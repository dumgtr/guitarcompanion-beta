'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

let totalSuites = 0;
let passedSuites = 0;
let failedSuites = 0;

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

let currentSuiteName = '';
let currentSuiteFailed = false;

function startSuite(name) {
  totalSuites++;
  currentSuiteName = name;
  currentSuiteFailed = false;
  console.log(`\n[SUITE] ${name}`);
}

function endSuite() {
  if (currentSuiteFailed) {
    failedSuites++;
  } else {
    passedSuites++;
  }
}

function assert(condition, message, details = {}) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedAssertions++;
    currentSuiteFailed = true;
    console.error(`  [FAIL] ${message}`);
    if (details.expected !== undefined) console.error(`         Expected: ${details.expected}`);
    if (details.actual !== undefined) console.error(`         Actual:   ${details.actual}`);
    if (details.file !== undefined) console.error(`         File:     ${details.file}`);
    if (details.error !== undefined) console.error(`         Error:    ${details.error}`);
  }
}

function checkFileExists(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  return fs.existsSync(fullPath);
}

function readFileContent(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  return fs.readFileSync(fullPath, 'utf-8');
}

function runNodeCheck(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  const result = spawnSync(process.execPath, ['--check', fullPath], {
    cwd: REPO_ROOT,
    encoding: 'utf-8'
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function runChildSuite(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  const result = spawnSync(process.execPath, [fullPath], {
    cwd: REPO_ROOT,
    encoding: 'utf-8'
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function main() {
  console.log('=== MAIN APP REGRESSION HARNESS V1 ===');

  // SUITE A — Repository & Environment Hygiene
  startSuite('Repository & Environment Hygiene');
  {
    assert(checkFileExists('outputs/app.js'), 'outputs/app.js exists in repository', { file: 'outputs/app.js' });
    assert(checkFileExists('outputs/audio-engine.js'), 'outputs/audio-engine.js exists in repository', { file: 'outputs/audio-engine.js' });
    assert(checkFileExists('reports/retrigger-tail-cap-tests.js'), 'reports/retrigger-tail-cap-tests.js exists in repository', { file: 'reports/retrigger-tail-cap-tests.js' });

    const appContent = readFileContent('outputs/app.js');
    const audioContent = readFileContent('outputs/audio-engine.js');
    const testContent = readFileContent('reports/retrigger-tail-cap-tests.js');

    const hasConflictMarkers = (content) => /<<<<<<<|=======|>>>>>>>/.test(content);
    assert(!hasConflictMarkers(appContent), 'outputs/app.js contains no Git conflict markers', { file: 'outputs/app.js' });
    assert(!hasConflictMarkers(audioContent), 'outputs/audio-engine.js contains no Git conflict markers', { file: 'outputs/audio-engine.js' });
    assert(!hasConflictMarkers(testContent), 'reports/retrigger-tail-cap-tests.js contains no Git conflict markers', { file: 'reports/retrigger-tail-cap-tests.js' });

    const hasAbsoluteMachinePath = (content) => /C:\\Users\\|\/Users\/|\/home\//i.test(content);
    assert(!hasAbsoluteMachinePath(appContent), 'outputs/app.js contains no hardcoded absolute machine paths', { file: 'outputs/app.js' });
    assert(!hasAbsoluteMachinePath(audioContent), 'outputs/audio-engine.js contains no hardcoded absolute machine paths', { file: 'outputs/audio-engine.js' });
  }
  endSuite();

  // SUITE B — Production & Test Files Syntax Check
  startSuite('Production & Test Files Syntax Check');
  {
    const checkApp = runNodeCheck('outputs/app.js');
    assert(checkApp.status === 0, 'outputs/app.js parses with node --check', {
      file: 'outputs/app.js',
      expected: 'exit code 0',
      actual: `exit code ${checkApp.status}`,
      error: checkApp.stderr.trim()
    });

    const checkAudio = runNodeCheck('outputs/audio-engine.js');
    assert(checkAudio.status === 0, 'outputs/audio-engine.js parses with node --check', {
      file: 'outputs/audio-engine.js',
      expected: 'exit code 0',
      actual: `exit code ${checkAudio.status}`,
      error: checkAudio.stderr.trim()
    });

    const checkRetrigger = runNodeCheck('reports/retrigger-tail-cap-tests.js');
    assert(checkRetrigger.status === 0, 'reports/retrigger-tail-cap-tests.js parses with node --check', {
      file: 'reports/retrigger-tail-cap-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${checkRetrigger.status}`,
      error: checkRetrigger.stderr.trim()
    });
  }
  endSuite();

  // SUITE C — Existing Audio Retrigger Regression Suite
  startSuite('Existing Audio Retrigger Regression Suite');
  {
    const retriggerRun = runChildSuite('reports/retrigger-tail-cap-tests.js');
    assert(retriggerRun.status === 0, 'reports/retrigger-tail-cap-tests.js exited with exit code 0', {
      file: 'reports/retrigger-tail-cap-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${retriggerRun.status}`,
      error: retriggerRun.stderr.trim() || retriggerRun.stdout.trim()
    });

    const hasZeroFailed = /0 failed/i.test(retriggerRun.stdout);
    assert(hasZeroFailed, 'reports/retrigger-tail-cap-tests.js reported 0 failed assertions', {
      file: 'reports/retrigger-tail-cap-tests.js',
      expected: '0 failed assertions',
      actual: retriggerRun.stdout.trim().split('\n').pop()
    });
  }
  endSuite();

  // SUITE D — Main App Invariants Verification
  startSuite('Main App Invariants Verification');
  {
    const appContent = readFileContent('outputs/app.js');
    const audioContent = readFileContent('outputs/audio-engine.js');

    // D.1 Continue Practice entry points
    const hasContinuePracticeSource = appContent.includes('source: "continue-practice"');
    const hasContinuePracticeGuard = appContent.includes('source !== "continue-practice"');
    assert(hasContinuePracticeSource && hasContinuePracticeGuard, 'Continue Practice entry point and persistence guard present in outputs/app.js', { file: 'outputs/app.js' });

    // D.2 Instrument selector options (synth, nylon, electric)
    const hasInstrumentLabels = appContent.includes('synth: "Synth"') && appContent.includes('nylon: "Nylon"') && appContent.includes('electric: "Electric"');
    const hasInstrumentOptions = appContent.includes('value="synth"') && appContent.includes('value="nylon"') && appContent.includes('value="electric"');
    assert(hasInstrumentLabels && hasInstrumentOptions, 'Instrument selector supports synth, nylon, and electric', { file: 'outputs/app.js' });

    // D.3 FSL standard tuning array
    const hasFslTuning = appContent.includes('const FSL_OPEN_STRING_MIDI = Object.freeze([64, 59, 55, 50, 45, 40]);');
    assert(hasFslTuning, 'FSL open string tuning invariant [64, 59, 55, 50, 45, 40] present in outputs/app.js', { file: 'outputs/app.js' });

    // D.4 Nylon calibration range and makeup gain
    const hasNylonRange = audioContent.includes('Approved Nylon calibration must contain exactly MIDI 40-76.');
    const hasNylonMakeup = audioContent.includes('Approved Nylon global makeup must be exactly +0.5 dB.');
    assert(hasNylonRange && hasNylonMakeup, 'Nylon calibration invariant MIDI 40-76 and +0.5 dB makeup present in outputs/audio-engine.js', { file: 'outputs/audio-engine.js' });

    // D.5 Electric Schema v2 requirements
    const hasElectricSchemaV2 = audioContent.includes('approvedElectricMap.schemaVersion !== 2');
    const hasElectric37Entries = audioContent.includes('Schema must contain exactly 37 entries');
    const hasElectricAssetPath = audioContent.includes('assets/audio/electric/');
    assert(hasElectricSchemaV2 && hasElectric37Entries && hasElectricAssetPath, 'Electric Schema v2 invariant present in outputs/audio-engine.js', { file: 'outputs/audio-engine.js' });

    // D.6 AudioEngine canonical public exports
    const exportsToTest = [
      'unlock',
      'prepareElectricSampler',
      'prepareFslSynthSampler',
      'playNote',
      'releaseChannel',
      'stopChannel',
      'stopAllTonal',
      'getStatus',
      'getInstrumentAvailability'
    ];
    exportsToTest.forEach((exp) => {
      const isExported = new RegExp(`\\b${exp}\\b`).test(audioContent);
      assert(isExported, `AudioEngine public export '${exp}' present in outputs/audio-engine.js`, { file: 'outputs/audio-engine.js' });
    });
  }
  endSuite();

  // SUITE E — Failure Path Self-Test (Injected Fault when GC_REGRESSION_SELF_TEST_FAILURE=1)
  if (String(process.env.GC_REGRESSION_SELF_TEST_FAILURE || '').trim() === '1') {
    startSuite('Failure-Path Injected Fault Self-Test');
    {
      assert(false, 'INJECTED FAULT: Proving harness detects and reports failure correctly', {
        expected: 'self-test failure injection',
        actual: 'GC_REGRESSION_SELF_TEST_FAILURE=1'
      });
    }
    endSuite();
  }

  // Print Summary
  const isOverallPass = failedSuites === 0 && failedAssertions === 0;

  console.log('\n=== SUMMARY ===');
  console.log(`TOTAL_SUITES: ${totalSuites}`);
  console.log(`PASSED_SUITES: ${passedSuites}`);
  console.log(`FAILED_SUITES: ${failedSuites}`);
  console.log(`TOTAL_ASSERTIONS: ${totalAssertions}`);
  console.log(`PASSED_ASSERTIONS: ${passedAssertions}`);
  console.log(`FAILED_ASSERTIONS: ${failedAssertions}`);
  console.log(`FINAL_RESULT: ${isOverallPass ? 'PASS' : 'FAIL'}`);

  if (!isOverallPass) {
    process.exitCode = 1;
  }
}

main();
