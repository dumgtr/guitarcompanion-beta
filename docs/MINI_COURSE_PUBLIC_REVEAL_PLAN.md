# Mini Course Public Reveal Plan
Status: Historical Documentation / Superseded By Sprint 7B Reveal
Created: 2026-07-04

---

## 1. Status

Historical note as of Sprint 7C:

- Sprint 6 hidden QA: **PASS** after one real bugfix (type-to-confirm reset replaced browser `prompt()`).
- Sprint 6.5 pre-reveal QA: **PASS WITH BUGFIX** (reset type-to-confirm input received `aria-label`).
- Sprint 7B public reveal has been implemented.
- Rhythm Notation Starter is now public in the Practice Room on normal production load.
- This document is retained as historical reveal documentation.
- Dev preview URLs remain available as legacy QA shortcuts / future hidden-course helpers only.

---

## 2. Reveal Goal

### What to reveal

Reveal only one Mini Course:

- **Rhythm Notation Starter** (`rhythm-notation-starter`)
- 7-day optional mini course
- ~10 minutes per day
- Thai title: อ่านค่าจังหวะ: ตัวดำ ตัวหยุด และจังหวะตก-ยก

### Placement

- Practice Room / Practice Lab only.
- Near the Reference Shelf, visually separate from Reference Shelf.
- Mini Course Shelf sits below Reference Shelf in Practice Room ordering.
- Uses compact card layout.

### What NOT to reveal

- Fretboard Studio Lite — separate spec, separate feature, not in scope.
- Month 5-8 — must remain hidden.
- No new Month is created. Week 0 remains Week 0, not Month 0.
- No new Week is added.
- No roadmap progression item is created.

---

## 3. Recommended Reveal Strategy

### Data-driven reveal (recommended)

The reveal should be driven by the data, not by toggling the feature flag alone.

**Future Sprint 7B implementation should:**

1. Change `miniCourses[0].miniCourse.visibility` from `"hidden"` to `"public"` in `outputs/data.json`.
2. Update the `getMiniCourses()` filter in `outputs/app.js` to include courses where `visibility === "public"` on normal load (not just in preview mode).
3. Update the `isMiniCoursePreviewActive()` guard in `renderMiniCourseShelf()` so that public Mini Courses render without requiring dev flags.
4. Keep dev flags (`?miniCoursePreview=1`, etc.) functional for future hidden Mini Courses that are still in development.
5. Remove dev-facing copy and labels from the public-facing shelf and card UI.

**Why not just set `FEATURE_MINI_COURSE_SHELF = true`?**

Setting the feature flag to `true` while data still says `visibility: "hidden"` would create a confusing inconsistency: the shelf would appear but the course metadata would still claim it is hidden. The recommended approach is to make the data the source of truth for visibility, and have the renderer respect it.

### Current renderer code analysis

The following code areas will need changes during Sprint 7B. These are documented for planning — **do not implement now**.

#### Feature flag and preview gate

```
File: outputs/app.js
Line 195:  const FEATURE_MINI_COURSE_SHELF = false;
Line 322:  return FEATURE_MINI_COURSE_SHELF || Boolean(miniCoursePreviewMode);
```

Currently, `isMiniCoursePreviewActive()` returns `true` only when `FEATURE_MINI_COURSE_SHELF` is `true` OR a dev preview URL parameter is present. For public reveal, the renderer should also check whether any Mini Course in the data has `visibility: "public"`.

**Future change:** `isMiniCoursePreviewActive()` should return `true` if any loaded Mini Course has `visibility === "public"`, even without preview parameters. Alternatively, rename or restructure this to separate "has public courses" from "is in dev preview mode".

#### Course filter

```
File: outputs/app.js
Line 3948:  .filter((course) => course?.miniCourse?.id && course?.miniCourse?.visibility !== "public");
```

Currently, `getMiniCourses()` filters **out** courses where `visibility === "public"` and keeps courses where `visibility === "hidden"`. This is the dev-preview behavior: it shows only hidden/draft courses.

**Future change:** For public reveal, this filter should be updated:
- On normal load (no dev flags): show courses where `visibility === "public"`.
- On dev preview load: show all courses regardless of visibility, so both public and hidden courses appear for testing.

#### Shelf header copy

```
File: outputs/app.js
Line 3985:  month2CreateElement("p", "eyebrow", "Mini Course Shelf"),
Line 3986:  month2CreateElement("h2", "", "Mini Course Shelf"),
Line 3987:  month2CreateElement("p", "", "พื้นที่ทดลองแบบซ่อนสำหรับคอร์สเสริมสั้น ๆ ใน Practice Room เท่านั้น ยังไม่เปิดให้ผู้ใช้ทั่วไปเห็น")
```

**Future change:** Replace dev-facing text with public copy (see Section 4).

#### Card label

```
File: outputs/app.js
Line 4021:  month2CreateElement("p", "panel-label", "Preview / Hidden"),
```

**Future change:** Replace `"Preview / Hidden"` with the public-facing status chip (see Section 4).

---

## 4. Public Copy Plan

When the reveal is implemented, all dev-facing text must be replaced with friendly, student-facing Thai copy. The tone should match a warm private guitar teacher.

### Section header

| Element | Current (dev) | Future (public) |
| --- | --- | --- |
| Eyebrow | `Mini Course Shelf` | `คอร์สเสริมสั้น ๆ` |
| Heading | `Mini Course Shelf` | `คอร์สเสริมสั้น ๆ` |
| Description | `พื้นที่ทดลองแบบซ่อนสำหรับคอร์สเสริมสั้น ๆ ใน Practice Room เท่านั้น ยังไม่เปิดให้ผู้ใช้ทั่วไปเห็น` | (remove description or use short helpful line) |

### Course card

| Element | Current (dev) | Future (public) |
| --- | --- | --- |
| Panel label | `Preview / Hidden` | `เสริมพื้นฐาน` |
| Title | `Rhythm Notation Starter` | (keep English technical title or use Thai) |
| Thai title | `อ่านค่าจังหวะ: ตัวดำ ตัวหยุด และจังหวะตก-ยก` | (keep as-is) |
| CTA button | `เปิด Mini Course` | `เปิดคอร์สเสริม` |

### Recommended public copy values

- **Section label**: คอร์สเสริมสั้น ๆ
- **Course title**: อ่านจังหวะพื้นฐาน 7 วัน
- **Course description**: ฝึกอ่านค่าจังหวะ ตัวดำ ตัวหยุด และจังหวะตก-ยก แบบสั้น ๆ วันละประมาณ 10 นาที
- **CTA**: เปิดคอร์สเสริม
- **Status chip**: เสริมพื้นฐาน
- **Optional label**: ไม่กระทบความคืบหน้าเดือนหลัก

### Words to remove from public UI

The following dev-facing words must not appear in public-facing copy:

- hidden
- dev
- preview
- QA
- experimental
- not public
- พื้นที่ทดลองแบบซ่อน
- ยังไม่เปิดให้ผู้ใช้ทั่วไปเห็น

---

## 5. Future Data Changes

**Document only. Do not edit data now.**

Future Sprint 7B may change `outputs/data.json`:

```diff
  "miniCourse": {
    "id": "rhythm-notation-starter",
    "title": "Rhythm Notation Starter",
    "thaiTitle": "อ่านค่าจังหวะ: ตัวดำ ตัวหยุด และจังหวะตก-ยก",
    "status": "live",
-   "visibility": "hidden",
+   "visibility": "public",
    "placement": "practice-room-mini-course-shelf",
    "optional": true,
    ...
  }
```

### Data placement rules (confirmed)

- Keep root-level `miniCourses[]` structure.
- Do not move Mini Course data into `weeks[]`.
- Do not move Mini Course data into Month data.
- Do not create Month 0.
- Do not expose Month 5-8 data.
- All other `miniCourses[]` entries (if any future ones exist) remain at their own visibility level.

---

## 6. Future Renderer Changes

**Document only. Do not implement now.**

After Sprint 7B implementation, the renderer should behave as follows:

### Normal production load (no dev flags)

- Public Mini Courses (where `visibility === "public"`) appear in the Practice Room Mini Course Shelf section.
- Hidden Mini Courses do not appear.
- Mini Course Shelf is visible if at least one public Mini Course exists.
- Mini Course does not appear in topbar navigation.
- Mini Course does not appear in Month Switcher.
- Mini Course does not appear in Week tabs.

### Dev preview load (with `?miniCoursePreview=1` or similar)

- All Mini Courses appear regardless of visibility, for testing.
- Dev flags continue to work for future hidden/draft Mini Courses.

### Progress behavior

- Existing progress key remains: `gc:mini:rhythm-notation-starter:progress:v1`
- Existing hidden QA progress (if any was saved during dev testing) should be preserved. The reveal should not clear localStorage.
- Main reset still does not clear Mini Course progress.
- Mini Course progress remains isolated from Month progress, Week 0 checklist, Practice Notes, and Reference Shelf state.

---

## 7. QA Plan for Sprint 7B

When the public reveal is implemented, the following QA matrix must be executed before the change is considered complete.

### Normal load checks

- [ ] Mini Course Shelf appears in Practice Room on normal load (no URL parameters).
- [ ] Month 1 opens by default.
- [ ] Month Switcher shows Month 1-4 only.
- [ ] Month 5-8 do not appear anywhere.
- [ ] Week 0 remains public as Week 0, not as Month 0.
- [ ] Reference Shelf still works: TAB Handbook opens, Note Value Cheatsheet opens.
- [ ] No `"Preview / Hidden"`, `"hidden"`, `"dev"`, `"QA"`, or `"พื้นที่ทดลองแบบซ่อน"` visible in public UI.

### Mini Course functional checks

- [ ] Course card appears with public copy.
- [ ] Card opens course detail view.
- [ ] Day selector 1-7 works.
- [ ] Self-check save/restore works after page reload.
- [ ] Reset below or equal 50% progress uses normal confirm modal and clears progress.
- [ ] Reset above 50% progress requires typing `RESET MINI COURSE` in the type-to-confirm box.
- [ ] Main reset (Month progress reset) does not clear Mini Course progress.
- [ ] Reference links inside Mini Course open TAB Handbook and Note Value Cheatsheet.

### Mobile checks

- [ ] 320px viewport: no body-level horizontal overflow.
- [ ] 390px viewport: no body-level horizontal overflow.
- [ ] 430px viewport: no body-level horizontal overflow.
- [ ] Day selector and count maps scroll inside their own boxes.
- [ ] All buttons remain tappable with mobile-safe tap targets (44px+).

### Keyboard checks

- [ ] Course CTA is reachable by Tab.
- [ ] Enter or Space opens the course.
- [ ] Day 1-7 buttons are keyboard reachable.
- [ ] Space toggles self-check checkboxes.
- [ ] Reset confirmation flow is reachable by keyboard.
- [ ] No keyboard trap exists.
- [ ] Focus outlines are visible throughout.

### Accessibility checks

- [ ] Mini Course Shelf has a useful accessible name (via `aria-labelledby` or equivalent).
- [ ] CTA and day selector use real `<button>` elements.
- [ ] Current day state is exposed (via `aria-pressed` or `aria-current`).
- [ ] Completed state is not communicated by color only.
- [ ] Type-to-confirm input has an accessible name (`aria-label`).
- [ ] No duplicate IDs are introduced.

### Code checks

- [ ] `node --check outputs/app.js` passes.
- [ ] `JSON.parse(fs.readFileSync('outputs/data.json'))` passes.
- [ ] No app-origin console errors at `127.0.0.1` on normal load.
- [ ] Chrome extension warnings (if any) are external and not from the app.

---

## 8. Rollback Plan

If the public reveal causes issues, rollback should be simple and low-risk:

1. Change `miniCourses[0].miniCourse.visibility` back from `"public"` to `"hidden"` in `outputs/data.json`.
2. Revert any renderer logic changes that distinguish public from hidden courses.
3. Keep dev flags (`?miniCoursePreview=1`, etc.) available for continued testing.
4. Do **not** delete Mini Course progress from localStorage. Existing user progress must be preserved even on rollback.
5. Re-run hidden regression QA to confirm Mini Course is hidden on normal load.
6. Confirm Month 5-8 remain hidden.
7. Confirm Month 1 opens by default after rollback.

Rollback should require editing only `outputs/data.json` and `outputs/app.js`. No structural changes to `outputs/index.html` should be needed.

---

## 9. Approval Gate

Historical note: Sprint 7B approval was received and the controlled public reveal was implemented.

Current guardrails after reveal:

- Do not expose Month 5-8.
- Do not create Month 0.
- Do not implement or reveal Fretboard Studio Lite from this Mini Course plan.
- Do not remove legacy dev flags; they remain useful for future hidden Mini Course QA.

---

## 10. Expected Sprint 7B Files

When implementation is approved, the following files are likely to be modified:

| File | Expected change |
| --- | --- |
| `outputs/data.json` | Change `visibility` from `"hidden"` to `"public"` for Rhythm Notation Starter. |
| `outputs/app.js` | Update `getMiniCourses()` filter, `isMiniCoursePreviewActive()` guard, shelf header copy, card label copy, CTA button text. |
| `outputs/styles.css` | Only if UI adjustments are needed for public-facing card styling. |
| `docs/PROJECT_STATE.md` | Record that public reveal was implemented. |
| `docs/AI_HANDOFF.md` | Record that public reveal was implemented and QA result. |

Files that must NOT be changed during Sprint 7B:

| File | Reason |
| --- | --- |
| `docs/FRETBOARD_STUDIO_LITE_SPEC.md` | Separate feature, not in scope. |
| `outputs/index.html` | Only if structural HTML changes are truly required; prefer JS-rendered content. |

---

## 11. Acceptance Criteria

Public reveal is accepted only if ALL of the following are true:

- [x] Rhythm Notation Starter appears in Practice Room on normal load.
- [x] It appears **nowhere else** (no topbar, no Month Switcher, no Week tab).
- [x] Month 1 remains the default open month.
- [x] Month 1-4 only are visible in the Month Switcher.
- [x] Month 5-8 remain completely hidden.
- [x] Week 0 remains Week 0 — no Month 0 is created.
- [x] Reference Shelf is unchanged: TAB Handbook and Note Value Cheatsheet still work.
- [x] Existing Mini Course progress (from dev testing) is preserved.
- [x] Main reset does not clear Mini Course progress.
- [x] Mobile QA passes at 320px, 390px, and 430px with no body-level horizontal overflow.
- [x] Keyboard QA passes with no keyboard traps.
- [x] Accessibility QA passes with accessible names, real buttons, and non-color-only state.
- [x] No app-origin console errors.
- [x] Rollback remains simple (visibility change + filter revert).
- [x] All dev-facing copy has been replaced with public-facing Thai copy.
- [x] No dev words (`hidden`, `preview`, `QA`, `experimental`) appear in public UI.
- [x] Fretboard Studio Lite was not implemented or revealed.
