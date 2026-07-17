import { createReadStream } from "node:fs";
import { access, stat, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PORT = 5173;
const HOST = "127.0.0.1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.argv[2] || DEFAULT_PORT);
const root = path.resolve(process.argv[3] || path.join(__dirname, ".."));

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
  [".md", "text/markdown; charset=utf-8"]
]);

const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method || "")) {
      sendText(response, 405, "Method not allowed");
      return;
    }

    const url = new URL(request.url || "/", `http://${HOST}:${port}`);
    let pathname = decodePath(url.pathname);
    const isAlias = pathname === "/soundlab-v2" || pathname === "/soundlab-v2/";

    if ((pathname === "/" || pathname === "/index.html") && !(await exists(path.join(root, "index.html")))) {
      const outputIndex = path.join(root, "outputs", "index.html");
      if (await exists(outputIndex)) {
        redirect(response, "/outputs/index.html");
        return;
      }
    }

    if (isAlias) {
      pathname = "/outputs/index.html";
    }

    const filePath = await resolveFilePath(pathname);
    if (!filePath) {
      sendText(response, 404, "Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes.get(extension) || "application/octet-stream"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    if (isAlias && filePath.endsWith("index.html")) {
      let content = await readFile(filePath, "utf-8");
      if (!content.includes("<base ")) {
        content = content.replace("<head>", "<head>\n    <base href=\"/outputs/\">");
      }
      response.end(content);
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch (error) {
    sendText(response, 500, "Server error");
  }
});

server.listen(port, HOST, () => {
  console.log(`Guitar Companion static server`);
  console.log(`Serving: ${root}`);
  console.log(`Preview: http://${HOST}:${port}`);
});

server.on("error", (error) => {
  console.error(`Static server failed: ${error.message}`);
  process.exitCode = 1;
});

async function resolveFilePath(pathname) {
  const relativePath = pathname.replace(/^\/+/, "") || "index.html";
  const target = path.resolve(root, relativePath);

  if (!isInsideRoot(target)) return null;

  const targetStat = await stat(target).catch(() => null);
  if (!targetStat) return null;

  if (targetStat.isDirectory()) {
    const indexPath = path.join(target, "index.html");
    return (await exists(indexPath)) ? indexPath : null;
  }

  return targetStat.isFile() ? target : null;
}

function decodePath(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return "/";
  }
}

function isInsideRoot(target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function redirect(response, location) {
  response.writeHead(302, {
    "Cache-Control": "no-store",
    Location: location
  });
  response.end();
}

function sendText(response, status, message) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8"
  });
  response.end(message);
}
