import { createReadStream, readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { access, stat, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const DEFAULT_PORT = 5173;
const DEFAULT_HOST = "127.0.0.1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repositoryRoot = path.resolve(__dirname, "..");
const webRoot = path.join(repositoryRoot, "outputs");

// CLI Argument Parsing
const args = process.argv.slice(2);
const isStopCommand = args.includes("--stop");
const isIdentityCommand = args.includes("--identity");
const numericArg = args.find(a => !a.startsWith("--") && !isNaN(Number(a)));
const port = numericArg !== undefined ? Number(numericArg) : DEFAULT_PORT;
const host = DEFAULT_HOST;
let boundPort = port;

const getPidFilePath = (p) => path.join(os.tmpdir(), `guitarcompanion-preview-${p}.json`);

// PID & Identity Commands
if (isStopCommand) {
  stopOwnedServer(port, repositoryRoot);
  process.exit(0);
}

if (isIdentityCommand) {
  queryServerIdentity(host, port);
  process.exit(0);
}

// Startup Precondition Checks
verifyRepositoryFiles(repositoryRoot, webRoot);

// Git Telemetry
const gitTelemetry = getGitTelemetry(repositoryRoot);

// App SHA-256
const appSha256 = getAppSha256(webRoot);

// Content Type Map
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".mp3", "audio/mpeg"],
  [".wav", "audio/wav"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

const startedAtIso = new Date().toISOString();

const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method || "")) {
      sendText(response, 405, "Method not allowed");
      return;
    }

    const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
    let pathname = decodeURIComponent(requestUrl.pathname);

    // Endpoint: Identity JSON
    if (pathname === "/__gc_preview_identity") {
      sendIdentityJson(response);
      return;
    }

    // Path Traversal Security Guard
    if (pathname.includes("..") || pathname.includes("\0") || /[\%\\]/.test(pathname)) {
      // Decode check
      const rawUrl = request.url || "";
      if (rawUrl.includes("..") || rawUrl.includes("%2e%2e") || rawUrl.includes("%2E%2E") || rawUrl.includes("\\") || rawUrl.includes("\0")) {
        sendText(response, 400, "Bad Request: Path Traversal Rejected");
        return;
      }
    }

    // Direct Mapping: GET / -> outputs/index.html, GET /app.js -> outputs/app.js, GET /styles.css -> outputs/styles.css
    let targetRelative = pathname.replace(/^\/+/, "");
    if (targetRelative === "" || targetRelative === "index.html") {
      targetRelative = "index.html";
    }

    const resolvedFile = path.resolve(webRoot, targetRelative);

    // Verify inside webRoot
    if (!isInsideDir(webRoot, resolvedFile)) {
      sendText(response, 400, "Bad Request: Path Traversal Rejected");
      return;
    }

    const fileStat = await stat(resolvedFile).catch(() => null);
    if (!fileStat || !fileStat.isFile()) {
      sendText(response, 404, "404 Not Found");
      return;
    }

    const ext = path.extname(resolvedFile).toLowerCase();
    const contentType = contentTypes.get(ext) || "application/octet-stream";

    // Header Telemetry
    setStandardHeaders(response, contentType);

    if (request.method === "HEAD") {
      response.writeHead(200);
      response.end();
      return;
    }

    response.writeHead(200);
    createReadStream(resolvedFile).pipe(response);
  } catch (err) {
    sendText(response, 500, "Server Error");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`\n[EADDRINUSE] Port ${port} is already occupied.`);
    console.error(`Cannot start Guitar Companion Deterministic Dev Preview Server.`);
    console.error(`Port collisions fail loudly to prevent testing against a stale or foreign server.\n`);
    process.exit(1);
  } else {
    console.error(`[ServerError] ${error.message}`);
    process.exit(1);
  }
});

server.listen(port, host, () => {
  const addr = server.address();
  boundPort = typeof addr === "object" && addr && addr.port ? addr.port : port;

  // Write PID Ownership Record
  writePidRecord();

  // Print Banner
  printStartupBanner();
});

// Process Signal Listeners
process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("exit", () => removePidRecordIfOwned());

function handleShutdown(signal) {
  removePidRecordIfOwned();
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 200).unref();
}

function verifyRepositoryFiles(repoRoot, outputsDir) {
  const reqRepo = [path.join(repoRoot, "package.json"), outputsDir, path.join(outputsDir, "index.html"), path.join(outputsDir, "app.js")];
  for (const f of reqRepo) {
    if (!existsSync(f)) {
      console.error(`[PreconditionError] Required repository path missing: ${f}`);
      process.exit(1);
    }
  }
}

function getGitTelemetry(repoRoot) {
  try {
    const gitSha = execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf-8" }).trim();
    const shortGitSha = execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf-8" }).trim();
    const branch = execSync("git branch --show-current", { cwd: repoRoot, encoding: "utf-8" }).trim() || "HEAD";
    const gitTopLevel = execSync("git rev-parse --show-toplevel", { cwd: repoRoot, encoding: "utf-8" }).trim();

    return {
      identityVerified: true,
      gitSha,
      shortGitSha,
      branch,
      gitTopLevel
    };
  } catch (err) {
    if (process.env.GC_PREVIEW_ALLOW_UNKNOWN === "1") {
      return {
        identityVerified: false,
        gitSha: "UNKNOWN",
        shortGitSha: "UNKNOWN",
        branch: "UNKNOWN",
        gitTopLevel: repoRoot
      };
    }
    console.error(`[GitTelemetryError] Failed to resolve Git identity from ${repoRoot}: ${err.message}`);
    process.exit(1);
  }
}

function getAppSha256(outputsDir) {
  const appPath = path.join(outputsDir, "app.js");
  const content = readFileSync(appPath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function setStandardHeaders(response, contentType) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("Content-Type", contentType);
  response.setHeader("X-GC-Git-Branch", sanitizeHeaderValue(gitTelemetry.branch));
  response.setHeader("X-GC-Git-Commit", sanitizeHeaderValue(gitTelemetry.gitSha));
  response.setHeader("X-GC-Server-Port", String(boundPort));
  response.setHeader("X-GC-App-SHA256", appSha256);
  response.setHeader("X-GC-Identity-Verified", String(gitTelemetry.identityVerified));
}

function sendIdentityJson(response) {
  const uptimeSeconds = Math.round((process.uptime() + Number.EPSILON) * 10) / 10;
  const payload = {
    status: "ok",
    application: "Guitar Companion Dev Preview",
    identityVerified: gitTelemetry.identityVerified,
    branch: gitTelemetry.branch,
    gitSha: gitTelemetry.gitSha,
    shortGitSha: gitTelemetry.shortGitSha,
    repositoryRoot,
    webRoot,
    appSha256,
    serverPid: process.pid,
    host,
    port: boundPort,
    startedAt: startedAtIso,
    uptimeSeconds,
    cachePolicy: "no-store"
  };

  setStandardHeaders(response, "application/json; charset=utf-8");
  response.writeHead(200);
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, status, message) {
  setStandardHeaders(response, "text/plain; charset=utf-8");
  response.writeHead(status);
  response.end(message);
}

function isInsideDir(parentDir, targetPath) {
  const rel = path.relative(parentDir, targetPath);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function sanitizeHeaderValue(val) {
  return String(val || "").replace(/[\r\n]/g, "").trim();
}

function writePidRecord() {
  try {
    const record = {
      pid: process.pid,
      repositoryRoot,
      webRoot,
      gitSha: gitTelemetry.gitSha,
      appSha256,
      host,
      port: boundPort,
      startedAt: startedAtIso,
      serverModulePath: __filename
    };
    writeFileSync(getPidFilePath(boundPort), JSON.stringify(record, null, 2), "utf-8");
  } catch (err) {
    console.warn(`[PidRecordWarning] Could not write PID file ${getPidFilePath(boundPort)}: ${err.message}`);
  }
}

function removePidRecordIfOwned() {
  try {
    const pidPath = getPidFilePath(boundPort);
    if (existsSync(pidPath)) {
      const raw = readFileSync(pidPath, "utf-8");
      const record = JSON.parse(raw);
      if (record && record.pid === process.pid) {
        unlinkSync(pidPath);
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}

function stopOwnedServer(targetPort, repoRoot) {
  const targetPidPath = getPidFilePath(targetPort);
  if (!existsSync(targetPidPath)) {
    console.log(`[StopServer] No server PID record found for port ${targetPort}.`);
    return;
  }
  try {
    const raw = readFileSync(targetPidPath, "utf-8");
    const record = JSON.parse(raw);
    if (record && record.pid && record.repositoryRoot === repoRoot) {
      console.log(`[StopServer] Stopping owned server PID ${record.pid} on port ${targetPort}...`);
      process.kill(record.pid, "SIGTERM");
      if (existsSync(targetPidPath)) {
        unlinkSync(targetPidPath);
      }
      console.log(`[StopServer] Server PID ${record.pid} terminated successfully.`);
    } else {
      console.log(`[StopServer] Server PID record does not match repository root. Skipping.`);
    }
  } catch (err) {
    console.error(`[StopServerError] ${err.message}`);
  }
}

function queryServerIdentity(targetHost, targetPort) {
  import("http").then(http => {
    http.get(`http://${targetHost}:${targetPort}/__gc_preview_identity`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        console.log(`=== PREVIEW SERVER IDENTITY (Port ${targetPort}) ===`);
        console.log(data);
      });
    }).on("error", (err) => {
      console.error(`[IdentityQueryError] Failed to connect to http://${targetHost}:${targetPort}: ${err.message}`);
    });
  });
}

function printStartupBanner() {
  console.log(`\n==================================================`);
  console.log(`🎸 Guitar Companion Deterministic Preview Server V1`);
  console.log(`==================================================`);
  console.log(`URL:             http://${host}:${boundPort}/`);
  console.log(`Identity URL:    http://${host}:${boundPort}/__gc_preview_identity`);
  console.log(`Branch:          ${gitTelemetry.branch}`);
  console.log(`Git SHA:         ${gitTelemetry.gitSha}`);
  console.log(`Repository root: ${repositoryRoot}`);
  console.log(`Web root:        ${webRoot}`);
  console.log(`App SHA-256:     ${appSha256}`);
  console.log(`PID:             ${process.pid}`);
  console.log(`Host:            ${host}`);
  console.log(`Port:            ${boundPort}`);
  console.log(`Cache:           no-store, max-age=0`);
  console.log(`Identity:        ${gitTelemetry.identityVerified ? "VERIFIED (QA-READY)" : "UNVERIFIED"}`);
  console.log(`==================================================\n`);
}
