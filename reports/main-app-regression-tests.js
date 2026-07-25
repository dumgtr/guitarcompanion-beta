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
    assert(checkFileExists('outputs/styles.css'), 'outputs/styles.css exists in repository', { file: 'outputs/styles.css' });
    assert(checkFileExists('reports/retrigger-tail-cap-tests.js'), 'reports/retrigger-tail-cap-tests.js exists in repository', { file: 'reports/retrigger-tail-cap-tests.js' });
    assert(checkFileExists('reports/continue-practice-v2-tests.js'), 'reports/continue-practice-v2-tests.js exists in repository', { file: 'reports/continue-practice-v2-tests.js' });
    assert(checkFileExists('reports/practice-completion-v1-tests.js'), 'reports/practice-completion-v1-tests.js exists in repository', { file: 'reports/practice-completion-v1-tests.js' });
    assert(checkFileExists('reports/dev-preview-server-tests.js'), 'reports/dev-preview-server-tests.js exists in repository', { file: 'reports/dev-preview-server-tests.js' });
    assert(checkFileExists('reports/righthand-minicourse-phase1-tests.js'), 'reports/righthand-minicourse-phase1-tests.js exists in repository', { file: 'reports/righthand-minicourse-phase1-tests.js' });

    const appContent = readFileContent('outputs/app.js');
    const audioContent = readFileContent('outputs/audio-engine.js');
    const stylesContent = readFileContent('outputs/styles.css');
    const testContent = readFileContent('reports/retrigger-tail-cap-tests.js');
    const cpV2Content = readFileContent('reports/continue-practice-v2-tests.js');
    const practiceCompletionContent = readFileContent('reports/practice-completion-v1-tests.js');
    const lessonDelegationContent = readFileContent('reports/lesson-interaction-delegation-tests.js');
    const devServerContent = readFileContent('reports/dev-preview-server-tests.js');
    const rhcPhase1Content = readFileContent('reports/righthand-minicourse-phase1-tests.js');

    const hasConflictMarkers = (content) => /<<<<<<<|=======|>>>>>>>/.test(content);
    assert(!hasConflictMarkers(appContent), 'outputs/app.js contains no Git conflict markers', { file: 'outputs/app.js' });
    assert(!hasConflictMarkers(audioContent), 'outputs/audio-engine.js contains no Git conflict markers', { file: 'outputs/audio-engine.js' });
    assert(!hasConflictMarkers(stylesContent), 'outputs/styles.css contains no Git conflict markers', { file: 'outputs/styles.css' });
    assert(!hasConflictMarkers(testContent), 'reports/retrigger-tail-cap-tests.js contains no Git conflict markers', { file: 'reports/retrigger-tail-cap-tests.js' });
    assert(!hasConflictMarkers(cpV2Content), 'reports/continue-practice-v2-tests.js contains no Git conflict markers', { file: 'reports/continue-practice-v2-tests.js' });
    assert(!hasConflictMarkers(practiceCompletionContent), 'reports/practice-completion-v1-tests.js contains no Git conflict markers', { file: 'reports/practice-completion-v1-tests.js' });
    assert(!hasConflictMarkers(lessonDelegationContent), 'reports/lesson-interaction-delegation-tests.js contains no Git conflict markers', { file: 'reports/lesson-interaction-delegation-tests.js' });
    assert(!hasConflictMarkers(devServerContent), 'reports/dev-preview-server-tests.js contains no Git conflict markers', { file: 'reports/dev-preview-server-tests.js' });
    assert(!hasConflictMarkers(rhcPhase1Content), 'reports/righthand-minicourse-phase1-tests.js contains no Git conflict markers', { file: 'reports/righthand-minicourse-phase1-tests.js' });

    const hasAbsoluteMachinePath = (content) => /C:\\Users\\|\/Users\/|\/home\//i.test(content);
    assert(!hasAbsoluteMachinePath(appContent), 'outputs/app.js contains no hardcoded absolute machine paths', { file: 'outputs/app.js' });
    assert(!hasAbsoluteMachinePath(audioContent), 'outputs/audio-engine.js contains no hardcoded absolute machine paths', { file: 'outputs/audio-engine.js' });
    assert(!hasAbsoluteMachinePath(cpV2Content), 'reports/continue-practice-v2-tests.js contains no hardcoded absolute machine paths', { file: 'reports/continue-practice-v2-tests.js' });
    assert(!hasAbsoluteMachinePath(practiceCompletionContent), 'reports/practice-completion-v1-tests.js contains no hardcoded absolute machine paths', { file: 'reports/practice-completion-v1-tests.js' });
    assert(!hasAbsoluteMachinePath(lessonDelegationContent), 'reports/lesson-interaction-delegation-tests.js contains no hardcoded absolute machine paths', { file: 'reports/lesson-interaction-delegation-tests.js' });
    assert(!hasAbsoluteMachinePath(devServerContent), 'reports/dev-preview-server-tests.js contains no hardcoded absolute machine paths', { file: 'reports/dev-preview-server-tests.js' });
    assert(!hasAbsoluteMachinePath(rhcPhase1Content), 'reports/righthand-minicourse-phase1-tests.js contains no hardcoded absolute machine paths', { file: 'reports/righthand-minicourse-phase1-tests.js' });
  }
  endSuite();

  // SUITE B — Production & Test Files Syntax Check
  startSuite('Production & Test Files Syntax Check');
  {
    const stylesContent = readFileContent('outputs/styles.css');
    const requiredCssSelectors = [
      ':root',
      '.practice-day.is-completed',
      '#markDayCompleteButton',
      '.rhythm-geometry-card'
    ];
    assert(
      requiredCssSelectors.every((selector) => stylesContent.includes(selector)),
      'outputs/styles.css contains required application selectors',
      {
        file: 'outputs/styles.css',
        expected: requiredCssSelectors.join(', ')
      }
    );

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

    const checkCpV2 = runNodeCheck('reports/continue-practice-v2-tests.js');
    assert(checkCpV2.status === 0, 'reports/continue-practice-v2-tests.js parses with node --check', {
      file: 'reports/continue-practice-v2-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${checkCpV2.status}`,
      error: checkCpV2.stderr.trim()
    });

    const checkPracticeCompletion = runNodeCheck('reports/practice-completion-v1-tests.js');
    assert(checkPracticeCompletion.status === 0, 'reports/practice-completion-v1-tests.js parses with node --check', {
      file: 'reports/practice-completion-v1-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${checkPracticeCompletion.status}`,
      error: checkPracticeCompletion.stderr.trim()
    });

    const checkDelegation = runNodeCheck('reports/lesson-interaction-delegation-tests.js');
    assert(checkDelegation.status === 0, 'reports/lesson-interaction-delegation-tests.js parses with node --check', {
      file: 'reports/lesson-interaction-delegation-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${checkDelegation.status}`,
      error: checkDelegation.stderr.trim()
    });

    const checkServer = runNodeCheck('reports/dev-preview-server-tests.js');
    assert(checkServer.status === 0, 'reports/dev-preview-server-tests.js parses with node --check', {
      file: 'reports/dev-preview-server-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${checkServer.status}`,
      error: checkServer.stderr.trim()
    });

    const checkRhcPhase1 = runNodeCheck('reports/righthand-minicourse-phase1-tests.js');
    assert(checkRhcPhase1.status === 0, 'reports/righthand-minicourse-phase1-tests.js parses with node --check', {
      file: 'reports/righthand-minicourse-phase1-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${checkRhcPhase1.status}`,
      error: checkRhcPhase1.stderr.trim()
    });
  }
  endSuite();

  // SUITE C — Child Test Suites
  startSuite('Child Test Suites (Audio Retrigger, Continue Practice V2, Practice Completion V1, Lesson Delegation, Dev Server, & RHC Phase 1)');
  {
    const retriggerRun = runChildSuite('reports/retrigger-tail-cap-tests.js');
    assert(retriggerRun.status === 0, 'reports/retrigger-tail-cap-tests.js exited with exit code 0', {
      file: 'reports/retrigger-tail-cap-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${retriggerRun.status}`,
      error: retriggerRun.stderr.trim() || retriggerRun.stdout.trim()
    });

    const cpV2Run = runChildSuite('reports/continue-practice-v2-tests.js');
    assert(cpV2Run.status === 0, 'reports/continue-practice-v2-tests.js exited with exit code 0', {
      file: 'reports/continue-practice-v2-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${cpV2Run.status}`,
      error: cpV2Run.stderr.trim() || cpV2Run.stdout.trim()
    });

    const practiceCompletionRun = runChildSuite('reports/practice-completion-v1-tests.js');
    assert(practiceCompletionRun.status === 0, 'reports/practice-completion-v1-tests.js exited with exit code 0', {
      file: 'reports/practice-completion-v1-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${practiceCompletionRun.status}`,
      error: practiceCompletionRun.stderr.trim() || practiceCompletionRun.stdout.trim()
    });

    const delegationRun = runChildSuite('reports/lesson-interaction-delegation-tests.js');
    assert(delegationRun.status === 0, 'reports/lesson-interaction-delegation-tests.js exited with exit code 0', {
      file: 'reports/lesson-interaction-delegation-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${delegationRun.status}`,
      error: delegationRun.stderr.trim() || delegationRun.stdout.trim()
    });

    const serverRun = runChildSuite('reports/dev-preview-server-tests.js');
    assert(serverRun.status === 0, 'reports/dev-preview-server-tests.js exited with exit code 0', {
      file: 'reports/dev-preview-server-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${serverRun.status}`,
      error: serverRun.stderr.trim() || serverRun.stdout.trim()
    });

    const rhcPhase1Run = runChildSuite('reports/righthand-minicourse-phase1-tests.js');
    assert(rhcPhase1Run.status === 0, 'reports/righthand-minicourse-phase1-tests.js exited with exit code 0', {
      file: 'reports/righthand-minicourse-phase1-tests.js',
      expected: 'exit code 0',
      actual: `exit code ${rhcPhase1Run.status}`,
      error: rhcPhase1Run.stderr.trim() || rhcPhase1Run.stdout.trim()
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

    // D.6 AudioEngine public exports contract
    const requiredExports = [
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

    requiredExports.forEach((exportName) => {
      const hasExport = new RegExp(`\\b${exportName}\\b`).test(audioContent);
      assert(hasExport, `AudioEngine public export '${exportName}' present in outputs/audio-engine.js`, { file: 'outputs/audio-engine.js' });
    });

    // D.7 Rhythm Geometry Block Invariants
    const hasRhythmGeometryDispatch = appContent.includes('block.type === "rhythm-geometry"') && appContent.includes('renderRhythmGeometryBlock(block)');
    const hasRhythmGeometryRenderer = appContent.includes('function renderRhythmGeometryBlock');
    const hasStepListener = appContent.includes('gc:metronome-step') && appContent.includes('data-rhythm-step-index');
    assert(hasRhythmGeometryDispatch && hasRhythmGeometryRenderer && hasStepListener, 'Rhythm Geometry block renderer, dispatcher, and step listener present in outputs/app.js', { file: 'outputs/app.js' });

    const stylesContent = readFileContent('outputs/styles.css');
    const hasRhythmGeometryStyles = stylesContent.includes('.rhythm-geometry-card') && stylesContent.includes('.rhythm-mode-btn') && stylesContent.includes('.is-active');
    assert(hasRhythmGeometryStyles, 'Rhythm Geometry block CSS styles, tabs and pulse highlights present in outputs/styles.css', { file: 'outputs/styles.css' });

    // D.8 Production Block Count Invariant (Exactly 1 block in Month 1 Week 2)
    const rhythmBlockMatches = appContent.match(/(?:"type"|type):\s*"rhythm-geometry"/g) || [];
    assert(rhythmBlockMatches.length === 1, 'Exactly 1 rhythm-geometry block exists in production foundationWeeks (Week 2)', {
      file: 'outputs/app.js',
      expected: 1,
      actual: rhythmBlockMatches.length
    });

    // D.9 Production Block ID and Week Location
    const hasWeek2BlockId = appContent.includes('id: "w2-rhythm-geometry-16th-syncopation"');
    assert(hasWeek2BlockId, 'Rhythm Geometry block w2-rhythm-geometry-16th-syncopation present in Week 2 data', { file: 'outputs/app.js' });

    // D.10 4 Beats x 4 Subbeats Structure (16 subbeats total) and 4 Mnemonic modes
    const has4Beats = appContent.includes('beat: 1') && appContent.includes('beat: 2') && appContent.includes('beat: 3') && appContent.includes('beat: 4');
    const has4Mnemonics = appContent.includes('food_en:') && appContent.includes('takadimi:') && appContent.includes('counting:') && appContent.includes('food_th:');
    assert(has4Beats && has4Mnemonics, 'Rhythm Geometry production data contains 4 beats x 4 subbeats with all 4 mnemonic modes', { file: 'outputs/app.js' });

    // D.11 No independent setInterval musical clock in renderer
    const rendererSlice = appContent.slice(appContent.indexOf('function renderRhythmGeometryBlock'), appContent.indexOf('function renderMonth2TextBlock'));
    const hasIndependentClock = rendererSlice.includes('setInterval(') || rendererSlice.includes('setTimeout(');
    assert(!hasIndependentClock, 'renderRhythmGeometryBlock contains no independent setInterval musical clock', { file: 'outputs/app.js' });

    // D.12 Metronome event dispatch contract
    const hasMetronomeStepEmitter = appContent.includes('emitMetronomeStep(') && appContent.includes('new CustomEvent("gc:metronome-step"');
    const hasMetronomeStopEmitter = appContent.includes('new CustomEvent("gc:metronome-stop")');
    assert(hasMetronomeStepEmitter && hasMetronomeStopEmitter, 'Metronome dispatches gc:metronome-step and gc:metronome-stop events', { file: 'outputs/app.js' });
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
