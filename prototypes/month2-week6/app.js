const data = window.WEEK6_MOCK_DATA;

(function () {

  if (!data) {
    document.body.textContent = "ไม่พบข้อมูล Prototype";
    return;
  }

  const visualsById = byId(data.fretboardVisuals);
  const tabsById = byId(data.miniTabs);

  document.addEventListener("DOMContentLoaded", () => {
    renderHero(data.weekMeta);
    renderLessonBlocks(data.lessonBlocks, visualsById, tabsById);
    renderDailyPractice(data.dailyPractice);
    renderSelfCheck(data.selfCheck);
    bindScrollButtons();
    updateProgress();
  });

  function byId(items = []) {
    return Object.fromEntries(asArray(items).filter((item) => item?.id).map((item) => [item.id, item]));
  }

  function asArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function firstText(...values) {
    return values.find((value) => typeof value === "string" && value.trim()) || "";
  }

  function appendText(parent, value, className) {
    asArray(value).filter(Boolean).forEach((line) => {
      const paragraph = createElement("p", className || "", line);
      parent.appendChild(paragraph);
    });
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderHero(weekMeta) {
    const title = document.querySelector("#pageTitle");
    const subtitle = document.querySelector("#heroSubtitle");
    const promise = document.querySelector("#heroPromise");

    if (title) title.textContent = weekMeta.title;
    if (subtitle) subtitle.textContent = weekMeta.subtitle || "";
    if (promise) promise.textContent = weekMeta.promise || "";

    document.title = `Month ${weekMeta.month} Week ${weekMeta.week} Prototype - ${weekMeta.title}`;
  }

  function renderLessonBlocks(blocks, visuals, tabs) {
    const mount = document.querySelector("#lessonMount");
    if (!mount) return;
    if (!asArray(blocks).length) {
      mount.replaceChildren(renderMissingCard("ยังไม่มีข้อมูลบทเรียนสำหรับสัปดาห์นี้"));
      return;
    }

    const flow = createElement("div", "lesson-flow");

    asArray(blocks).forEach((block) => {
      if (block.type === "text") {
        flow.appendChild(renderTextBlock(block));
        return;
      }

      if (block.type === "fretboard") {
        flow.appendChild(renderFretboardVisual(visuals[block.visualRef], block, block.visualRef));
        return;
      }

      if (block.type === "tab") {
        flow.appendChild(renderMiniTab(tabs[block.tabRef], block, block.tabRef));
        return;
      }

      flow.appendChild(renderMissingCard(`ยังไม่รองรับ lesson block type: ${block.type || "unknown"}`));
    });

    mount.replaceChildren(flow);
  }

  function renderTextBlock(block) {
    const card = createElement("article", "lesson-text-block");
    const titleText = firstText(block.heading, block.title, "บทเรียน");

    card.append(createElement("p", "eyebrow", "บทเรียน"), createElement("h3", "", titleText));
    appendText(card, block.content || block.body || block.description);

    if (block.teacherNote) {
      const note = createElement("aside", "teacher-note");
      note.append(createElement("strong", "", "ครูแนะนำ"));
      appendText(note, block.teacherNote);
      card.appendChild(note);
    }

    if (block.instruction || block.practiceInstruction) {
      const instruction = createElement("div", "instruction-card");
      instruction.append(createElement("strong", "", "ลองทำ"));
      appendText(instruction, block.instruction || block.practiceInstruction);
      card.appendChild(instruction);
    }

    return card;
  }

  function renderFretboardVisual(visual, block = {}, visualRef = "") {
    if (!visual) return renderMissingCard(`ยังไม่มีภาพประกอบสำหรับบล็อกนี้${visualRef ? ` (${visualRef})` : ""}`);

    const card = createElement("article", "fretboard-card");
    card.dataset.visualId = visual.id;

    const head = createElement("header", "component-head");
    head.append(
      createElement("p", "eyebrow", "ภาพคอกีตาร์"),
      createElement("h3", "", block.title || visual.title),
      createElement("p", "caption", visual.caption)
    );

    const orientationNote = createElement(
      "p",
      "orientation-note fretboard-orientation",
      "แผนที่คอกีตาร์: วางสายเหมือน TAB มาตรฐาน — สาย 1 อยู่ด้านบน และสาย 6 อยู่ด้านล่าง"
    );

    const config = visual.config || {};
    const start = Number(config.startFret || 1);
    const end = Number(config.endFret || start);
    const fretCount = end - start + 1;

    const frame = createElement("div", "fretboard-frame");
    const grid = createElement("div", `fretboard-grid${config.showNut ? " has-nut" : ""}`);
    grid.style.setProperty("--fret-count", String(fretCount));
    grid.style.setProperty("--start-fret", String(start));
    grid.style.setProperty("--end-fret", String(end));
    grid.setAttribute("role", "img");
    grid.setAttribute("aria-label", visual.title);

    const lowLabel = createElement("span", "string-map-label string-map-label-top", "สาย 1 / High e");
    const highLabel = createElement("span", "string-map-label string-map-label-bottom", "สาย 6 / Low E");
    grid.append(lowLabel, highLabel);

    for (let wire = 0; wire <= fretCount; wire += 1) {
      const fretWire = createElement("span", "fret-wire");
      fretWire.style.left = `${(wire / fretCount) * 100}%`;
      fretWire.setAttribute("aria-hidden", "true");
      grid.appendChild(fretWire);
    }

    for (let stringNumber = 1; stringNumber <= 6; stringNumber += 1) {
      const stringLine = createElement("span", `string-line string-line-${stringNumber}`);
      stringLine.style.gridRow = String(stringNumber);
      stringLine.setAttribute("aria-hidden", "true");
      grid.appendChild(stringLine);
    }

    asArray(visual.dots).forEach((dot) => {
      const marker = createElement("span", `fret-dot dot-${dot.type}`, dot.label);
      const visualRow = dot.string;
      marker.style.gridRow = String(visualRow);
      marker.style.gridColumn = String(dot.fret - start + 1);
      marker.setAttribute("aria-label", `${dot.label} สาย ${dot.string} เฟรต ${dot.fret}`);
      grid.appendChild(marker);
    });

    const fretNumbers = createElement("div", "fret-numbers");
    fretNumbers.style.setProperty("--fret-count", fretCount);
    for (let fret = start; fret <= end; fret += 1) {
      fretNumbers.appendChild(createElement("span", "", String(fret)));
    }

    frame.append(grid, fretNumbers);

    const legend = createElement("ul", "legend-list");
    asArray(visual.legend).forEach((item) => {
      const li = createElement("li");
      const swatch = createElement("span", `legend-swatch swatch-${item.type}`);
      li.append(swatch, document.createTextNode(item.label));
      legend.appendChild(li);
    });

    card.append(head, orientationNote, frame);
    if (legend.children.length) card.appendChild(legend);
    return card;
  }

  function renderMiniTab(tab, block = {}, tabRef = "") {
    if (!tab) return renderMissingCard(`ยังไม่มี TAB สำหรับแบบฝึกนี้${tabRef ? ` (${tabRef})` : ""}`);

    const card = createElement("article", "mini-tab-card");
    card.dataset.tabId = tab.id;

    const head = createElement("header", "component-head");
    head.append(
      createElement("p", "eyebrow", "Clean Mini-TAB"),
      createElement("h3", "", block.title || tab.title),
      createElement("span", "bpm-pill", `${tab.bpm} BPM`)
    );

    const orientationNote = createElement(
      "p",
      "orientation-note tab-orientation",
      "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง"
    );
    const readNote = createElement("p", "tab-read-note", "TAB อ่านจากบนลงล่าง = สาย 1 ถึงสาย 6");

    const scrollArea = createElement("div", "mini-tab-scroll-area");
    const pre = createElement("pre", "tab-block");
    const code = createElement("code");
    code.textContent = asArray(tab.ascii).join("\n");
    const lyrics = createElement("code", "tab-lyrics-line");
    lyrics.textContent = Array.isArray(tab.lyrics) ? tab.lyrics.join(" ") : tab.lyrics;
    pre.append(code, document.createTextNode("\n"), lyrics);
    scrollArea.appendChild(pre);

    card.append(head, orientationNote, readNote, scrollArea, createElement("p", "practice-note", tab.note));
    return card;
  }

  function renderDailyPractice(items) {
    const mount = document.querySelector("#practiceMount");
    if (!mount) return;
    const note = createElement("p", "progress-note");
    note.id = "practiceProgress";

    if (!items || !asArray(items).length && !asArray(items.days).length && !asArray(items.tasks).length) {
      mount.replaceChildren(renderMissingCard("ยังไม่มี Daily Practice สำหรับสัปดาห์นี้"), note);
      return;
    }

    if (Array.isArray(items) && items.some(isPracticeGroup)) {
      const accordion = createElement("div", "practice-accordion");
      items.forEach((group, index) => accordion.appendChild(renderPracticeGroup(group, index)));
      mount.replaceChildren(accordion, note);
      return;
    }

    if (Array.isArray(items)) {
      const grid = createElement("div", "practice-grid");
      items.forEach((item) => grid.appendChild(renderPracticeTaskCard(item)));
      mount.replaceChildren(grid, note);
      return;
    }

    const wrap = createElement("div", "practice-days");
    const days = asArray(items.days);
    const sharedTasks = asArray(items.tasks);

    if (days.length) {
      days.forEach((day, index) => {
        const dayObject = typeof day === "object" ? { ...day } : { day, title: `Day ${day}` };
        const dayNumber = dayObject.day || dayObject.dayNumber || index + 1;
        const dayTasks = asArray(dayObject.tasks).length
          ? asArray(dayObject.tasks)
          : sharedTasks.filter((task) => !task?.day && !task?.dayNumber || Number(task.day || task.dayNumber) === Number(dayNumber));
        wrap.appendChild(renderPracticeDay({ ...dayObject, day: dayNumber, tasks: dayTasks }, index));
      });
    } else {
      const day = { day: 1, title: items.title || "Day 1", tasks: sharedTasks, duration: items.duration, goal: items.goal };
      wrap.appendChild(renderPracticeDay(day, 0));
    }

    mount.replaceChildren(wrap, note);
  }

  function isPracticeGroup(item = {}) {
    return Boolean(item.dayLabel || item.exercises || item.focus);
  }

  function renderPracticeGroup(group = {}, index = 0) {
    const panel = document.createElement("details");
    panel.className = "practice-panel";
    panel.open = Boolean(group.isOpen);

    const header = createElement("summary", "practice-panel-header");
    const title = createElement("span", "practice-panel-title");
    title.append(
      createElement("strong", "", group.dayLabel || `Day ${index + 1}`),
      createElement("span", "practice-panel-focus", group.focus || "ซ้อมประจำวัน")
    );

    const toggle = createElement("span", "practice-panel-toggle", panel.open ? "−" : "+");
    header.append(title, toggle);
    panel.addEventListener("toggle", () => {
      toggle.textContent = panel.open ? "−" : "+";
    });

    const body = createElement("div", "practice-panel-body");
    const exercises = asArray(group.exercises || group.tasks);

    if (exercises.length) {
      exercises.forEach((exercise) => body.appendChild(renderPracticeTaskCard(exercise)));
    } else {
      body.appendChild(renderMissingCard("ยังไม่มีแบบฝึกหัดในช่วงนี้"));
    }

    panel.append(header, body);
    return panel;
  }

  function renderPracticeTaskCard(item = {}) {
    const task = typeof item === "string" ? { title: item, instruction: item } : item;
    const card = createElement("article", "practice-card practice-exercise-card");
    const header = createElement("header");
    header.append(createElement("h3", "", firstText(task.title, task.name, "แบบฝึกหัด")), createElement("span", "day-duration", firstText(task.duration, task.time, "")));

    const label = createElement("label", "practice-check");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.practiceId = task.id || task.title || Math.random().toString(36).slice(2);
    checkbox.addEventListener("change", updateProgress);

    const body = createElement("span");
    appendText(body, task.instruction || task.goal || task.description || task.body);
    asArray(task.steps).forEach((step) => appendText(body, typeof step === "string" ? step : step.instruction || step.text || step.title, "task-step"));
    label.append(checkbox, body);

    card.append(header, label);
    return card;
  }

  function renderPracticeDay(day = {}, index = 0) {
    const details = document.createElement("details");
    details.className = "practice-day";
    if (index === 0) details.open = true;

    const summary = createElement("summary");
    const title = firstText(day.title, `Day ${day.day || index + 1}`);
    summary.append(
      createElement("strong", "", `Day ${day.day || index + 1}: ${title}`),
      createElement("span", "day-duration", firstText(day.duration, day.totalTime, ""))
    );

    const body = createElement("div", "practice-day-body");
    appendText(body, firstText(day.goal, day.focus, day.instruction), "day-goal");

    const tasks = asArray(day.tasks);
    if (tasks.length) {
      const grid = createElement("div", "practice-grid");
      tasks.forEach((task) => grid.appendChild(renderPracticeTaskCard(task)));
      body.appendChild(grid);
    } else {
      body.appendChild(renderPracticeTaskCard(day));
    }

    details.append(summary, body);
    return details;
  }

  function renderSelfCheck(selfCheck = {}) {
    const mount = document.querySelector("#selfCheckMount");
    if (!mount) return;

    if (!selfCheck || !Object.keys(selfCheck).length) {
      mount.replaceChildren(renderMissingCard("ยังไม่มี Self-Check สำหรับสัปดาห์นี้"));
      return;
    }

    const wrap = createElement("div", "self-card");

    const questions = asArray(selfCheck.questions);
    if (questions.length) {
      wrap.append(createElement("h3", "", "เช็กความเข้าใจ"));
      const questionList = createElement("div", "question-list");
      questions.forEach((item, index) => questionList.appendChild(renderSelfQuestion(item, index)));
      wrap.appendChild(questionList);
    }

    const passItems = asArray(selfCheck.passCriteria || selfCheck.criteria);
    if (passItems.length) {
      wrap.append(createElement("h3", "", "ผ่านเมื่อ"));
      const criteriaList = createElement("div", "criteria-list");
      passItems.forEach((item, index) => criteriaList.appendChild(renderPassItem(item, index)));
      wrap.appendChild(criteriaList);
    }

    if (selfCheck.passSummary) {
      const summary = createElement("p", "pass-summary", selfCheck.passSummary);
      wrap.appendChild(summary);
    }

    const troubleItems = asArray(selfCheck.troubleshooting);
    if (troubleItems.length) {
      wrap.append(createElement("h3", "", "ถ้ายังติด ให้ลองแก้แบบนี้"));
      const troubleList = createElement("div", "trouble-list");

      troubleItems.forEach((item) => {
        const details = document.createElement("details");
        const summary = createElement("summary", "", firstText(item.problem, item.issue, item.title, "ติดตรงนี้"));
        const advice = createElement("p", "", firstText(item.advice, item.fix, item.solution, item.body));
        details.append(summary, advice);
        troubleList.appendChild(details);
      });

      wrap.appendChild(troubleList);
    }

    if (!wrap.children.length) wrap.appendChild(renderMissingCard("ยังไม่มี Self-Check สำหรับสัปดาห์นี้"));
    mount.replaceChildren(wrap);
  }

  function renderSelfQuestion(item = {}, index = 0) {
    const type = item.type || (item.options || item.choices ? "multiple-choice" : "practical");
    if (type === "multiple-choice" || type === "quiz") return renderChoiceQuestion(item, index);
    return renderInstructionCheck(item);
  }

  function renderChoiceQuestion(item = {}, index = 0) {
    const card = createElement("article", "question-card");
    card.appendChild(createElement("h4", "", firstText(item.question, item.prompt, item.title, `คำถามที่ ${index + 1}`)));

    const choices = asArray(item.options || item.choices);
    const choicesWrap = createElement("div", "choice-grid");
    const feedback = createElement("p", "choice-feedback");

    choices.forEach((choice, choiceIndex) => {
      const button = createElement("button", "choice-button", typeof choice === "string" ? choice : firstText(choice.label, choice.text, choice.answer));
      button.type = "button";
      button.addEventListener("click", () => {
        const correct = isCorrectChoice(item, choice, choiceIndex);
        choicesWrap.querySelectorAll("button").forEach((itemButton) => itemButton.classList.remove("is-correct", "is-wrong"));
        button.classList.add(correct ? "is-correct" : "is-wrong");
        feedback.textContent = firstText(
          typeof choice === "object" ? choice.feedback : "",
          correct ? item.correctFeedback : item.incorrectFeedback,
          correct ? "ถูกครับ จำตำแหน่งนี้ไว้เป็นหลักหมุดได้เลย" : "ยังไม่ใช่ ลองมอง Root กับ Landmark อีกครั้ง"
        );
      });
      choicesWrap.appendChild(button);
    });

    card.append(choicesWrap, feedback);
    return card;
  }

  function isCorrectChoice(question, choice, index) {
    if (typeof choice === "object" && choice.isCorrect !== undefined) return Boolean(choice.isCorrect);
    if (typeof choice === "object" && choice.correct !== undefined) return Boolean(choice.correct);
    if (typeof question.answer === "number") return question.answer === index;
    if (typeof question.correctAnswer === "number") return question.correctAnswer === index;
    const label = typeof choice === "string" ? choice : firstText(choice.label, choice.text, choice.answer);
    return [question.answer, question.correctAnswer].some((answer) => String(answer || "").trim() === label.trim());
  }

  function renderPassItem(item, index) {
    if (typeof item === "string") {
      const label = createElement("label", "criteria-check");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.criteria = String(index);
      checkbox.addEventListener("change", updateProgress);
      label.append(checkbox, createElement("span", "", item));
      return label;
    }

    const type = item.type || "practical";
    if (type === "multiple-choice" || type === "quiz") return renderChoiceQuestion(item, index);
    return renderInstructionCheck(item);
  }

  function renderInstructionCheck(item = {}) {
    const card = createElement("article", "instruction-check");
    card.append(createElement("h4", "", firstText(item.title, item.question, item.prompt, item.name, "เช็กด้วยการเล่นจริง")));
    appendText(card, item.instruction || item.body || item.description || item.goal);
    asArray(item.steps).forEach((step) => appendText(card, typeof step === "string" ? step : step.instruction || step.text || step.title, "task-step"));
    return card;
  }

  function renderMissingCard(message) {
    const card = createElement("article", "lesson-text-block");
    card.append(createElement("p", "", message));
    return card;
  }

  function bindScrollButtons() {
    document.querySelectorAll("[data-scroll]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function updateProgress() {
    const checks = [...document.querySelectorAll('input[type="checkbox"]')];
    const done = checks.filter((item) => item.checked).length;
    const note = document.querySelector("#practiceProgress");
    if (note) {
      note.textContent = checks.length ? `เช็กแล้ว ${done}/${checks.length} รายการ` : "";
    }
  }
})();
