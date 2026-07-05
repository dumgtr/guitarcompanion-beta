# Blues Turnaround Starter — Controlled Public Reveal Plan

## 1. Status & Objective

| Field | Value |
|---|---|
| Course ID | `blues-turnaround-starter` |
| Current Visibility | `public` |
| Current Status | `live` |
| Target Visibility | `public` |
| Target Status | `live` |
| Preview QA Result | Sprint 8C.1 — 4/4 PASS (layout, navigation, gating, reset) |
| Approval Status | **APPROVED & IMPLEMENTED** — Sprint 8D executed on 2026-07-04 |

**Objective:** Transition the Blues Turnaround Starter from hidden/draft to public/live within the Mini Course Shelf, making it the second publicly available Mini Course alongside Rhythm Notation Starter.

This document is a pending-approval implementation plan. No production code may be modified until the approval gate in Section 6 is satisfied.

---

## 2. Controlled Data Migration Plan

### 2.1 `outputs/data.json` — Delta Changes

Locate the `miniCourses[]` entry where `"id": "blues-turnaround-starter"`.

**Change 1: Visibility**
```diff
- "visibility": "hidden",
+ "visibility": "public",
```

**Change 2: Status**
```diff
- "status": "draft",
+ "status": "live",
```

### 2.2 `outputs/app.js` — No Structural Changes Expected

The existing `getMiniCourses()` filter already supports multiple public courses:
```js
return all.filter((course) => course?.miniCourse?.visibility === "public");
```

No changes to the renderer filter, shelf header, or card renderer are required.  
The shelf already renders a grid of cards and handles multiple courses.

### 2.3 Files That Must NOT Be Modified

- `outputs/index.html`
- `outputs/styles.css`
- `docs/FRETBOARD_STUDIO_LITE_SPEC.md`
- Any Month 5-8 data or visibility gates
- Rhythm Notation Starter visibility or progress data

---

## 3. Public UI Copy Strategy

When Blues Turnaround Starter becomes public, it will appear as a second card on the Mini Course Shelf. The existing renderer already handles public copy via conditional checks on `meta.visibility === "public"`.

### 3.1 Shelf Header (Shared)

No change needed. The shelf header already reads:

> **คอร์สเสริมสั้น ๆ**

This naturally accommodates multiple courses.

### 3.2 Card Label (Chip)

The existing renderer assigns the chip label based on visibility:
- Public courses: **"เสริมพื้นฐาน"**
- Hidden/preview courses: **"Preview / Hidden"**

No change needed — the label will automatically switch when visibility becomes `"public"`.

### 3.3 CTA Button

The existing renderer assigns the CTA label based on visibility:
- Public courses: **"เปิดคอร์สเสริม"**
- Hidden/preview courses: **"เปิด Mini Course"**

No change needed — the CTA will automatically switch when visibility becomes `"public"`.

### 3.4 Card Content (From Data)

These values come directly from `data.json` and are already populated:

| Field | Value |
|---|---|
| Title | Blues Turnaround Starter |
| Thai Title | พื้นฐานบลูส์เทิร์นอะราวด์ |
| Duration | 7 วัน · วันละประมาณ 10 นาที |

### 3.5 Tone Check

The Thai copy inside the 7-day modules has been written in the "Private Guitar Teacher" persona: calm, encouraging, practical, with English music terms (Turnaround, Chromatic, Dominant 7, Metronome, Shuffle) used naturally alongside Thai explanation. This was verified during Sprint 8C.1 visual QA.

---

## 4. Post-Reveal Smoke Test Checklist

After the data migration is applied, execute the following verification steps:

### 4.1 Normal Production Load (No Query Params)

- [ ] Load `http://127.0.0.1:5173` without any preview parameters.
- [ ] Confirm the Mini Course Shelf renders in the Practice Room below the Reference Shelf.
- [ ] Confirm **two** course cards are visible: Rhythm Notation Starter and Blues Turnaround Starter.
- [ ] Confirm both cards display the public chip label "เสริมพื้นฐาน".
- [ ] Confirm both cards display the public CTA "เปิดคอร์สเสริม".
- [ ] Confirm Month 1 is the default fresh-load month.
- [ ] Confirm Month 5-8 are NOT visible in the Month Switcher.

### 4.2 Course Navigation

- [ ] Click "เปิดคอร์สเสริม" on Blues Turnaround Starter.
- [ ] Confirm the detail view opens with Day 1 content.
- [ ] Navigate through Day 1 to Day 7.
- [ ] Confirm all block types render correctly: `text`, `teacher-note`, `mini-tab`, `guitar-task`, `count-map`, `clap-task`, `reference-link`.
- [ ] Confirm no console errors during navigation.

### 4.3 Mobile Layout (390px / 430px)

- [ ] At 390px viewport width, confirm no horizontal body overflow.
- [ ] At 430px viewport width, confirm no horizontal body overflow.
- [ ] Confirm `mini-tab` blocks do not overflow their containers.
- [ ] Confirm card grid does not overflow.

### 4.4 Reset Behavior

- [ ] With Blues Turnaround Starter detail open, click the scroll-to-top button.
- [ ] Confirm the detail view closes but the shelf and cards remain visible.
- [ ] Re-open Blues Turnaround Starter, then click the top-left logo/brand.
- [ ] Confirm the detail view closes but the shelf and cards remain visible.

### 4.5 Cross-Course Isolation

- [ ] Open Rhythm Notation Starter and mark a day complete.
- [ ] Switch to Blues Turnaround Starter.
- [ ] Confirm the Rhythm Notation Starter progress is unchanged.
- [ ] Confirm the Blues Turnaround Starter has independent progress tracking.

### 4.6 Syntax Verification

- [ ] Run `node --check outputs/app.js` — must pass.
- [ ] Run `node -e "JSON.parse(require('fs').readFileSync('outputs/data.json','utf8')); console.log('OK')"` — must print `OK`.

---

## 5. Rollback Matrix

If a regression is discovered after the public reveal, apply the following immediate rollback:

### 5.1 Instant Hide (Data-Only Rollback)

In `outputs/data.json`, locate `"id": "blues-turnaround-starter"` and revert:

```diff
- "visibility": "public",
+ "visibility": "hidden",
```

```diff
- "status": "live",
+ "status": "draft",
```

This immediately removes the course from normal production load without affecting Rhythm Notation Starter or any other component.

### 5.2 Verification After Rollback

- Confirm Blues Turnaround Starter is no longer visible on normal load.
- Confirm Rhythm Notation Starter remains public and unaffected.
- Confirm `?miniCoursePreview=1` still shows the hidden course for debugging.
- Confirm no localStorage progress data is lost (progress keys are never deleted during rollback).

### 5.3 Escalation

If the regression affects shared Mini Course Shelf infrastructure (e.g., `renderMiniCourseShelf`, `getMiniCourses`, `closeMiniCourseDetail`), escalate to a full code review before re-attempting the reveal.

---

## 6. Absolute Approval Gate

> **⛔ EXECUTION BLOCKED**
>
> No production code or data may be modified to reveal the Blues Turnaround Starter until the following exact approval phrase is provided:
>
> **"Approve Sprint 8D Controlled Public Reveal Implementation."**
>
> Until this phrase is received, the course must remain `visibility: "hidden"` and `status: "draft"` in `outputs/data.json`.
>
> Any agent encountering this document must respect this gate unconditionally.
