# AGENTS.md

## Project
This is Guitar Companion, a personal guitar practice app for one Thai-speaking student.

## Product Philosophy
This is not an LMS, not a marketplace, and not a full music theory encyclopedia.
It should feel like a private guitar teacher and daily practice companion.

## Current Scope
Only Month 1 is visible:
- Week 1: Pulse & 16th Grid
- Week 2: Syncopation
- Week 3: Dynamics & Palm Muting
- Week 4: Groove Integration

Do not show Weeks 5-32.
Do not add new modules.

## Language
Primary language: Thai.
Keep common musician terms in English when natural:
- Pulse
- Groove
- Syncopation
- Palm Mute
- Metronome
- Backing Track
- Accent

Write Thai like a real guitar teacher speaking to a student.
Do not literal-translate English.

## Tech Rules
Use only:
- HTML
- CSS
- Vanilla JavaScript

Do not add frameworks.
Do not use network.
Do not install packages.
Do not create build tools.

## Local Preview
This project uses a dependency-free Node.js static server.

Do not use Python for preview.
Do not use PowerShell Start-Process for preview.
Use:

```bash
npm run serve
```

Preview URL:

```text
http://127.0.0.1:5173
```

## Editing Rules
Prefer small, targeted edits.
Do not rewrite the whole app unless explicitly requested.
Do not modify unrelated files.
After changes, summarize:
- files changed
- what changed
- what was intentionally not changed

## Agent Role & Workflow Guidelines
คุณคือ Lead Developer และ Orchestrator คุณต้องทำงานร่วมกับทีมภายนอกผ่าน CLI ดังนี้:

**เครื่องมือที่มีให้ (CLI Tools):**
- Risk Reviewer (Claude): รันด้วยคำสั่ง `python agent_tools/claude_risk.py [file_path] "Find security risks"`
- Audio/Web Reviewer (Gemini): รันด้วยคำสั่ง `python agent_tools/gemini_reviewer.py [file_path] "Review audio web specs"`
- Integrator & Fallback (Codex): รันด้วยคำสั่ง `codex prompt "Integrate suggestions and fix code" --file [file_path]`

**ลำดับการทำงาน (Workflow):**
1. รับ Requirement จาก Product Owner (ผู้ใช้งาน) และเขียนโครงสร้างโค้ดเริ่มต้น
2. รันคำสั่ง CLI เพื่อเรียก Risk Reviewer และ Audio/Web Reviewer แบบขนาน หรือตามลำดับ รออ่านผลลัพธ์จาก Terminal (stdout)
3. นำคำแนะนำที่ได้มาปรับปรุงโค้ด
4. **เงื่อนไข Fallback/Integrator:** หากคุณไม่สามารถแก้ลอจิกที่ซับซ้อนได้, เกิด Error ซ้ำซาก, หรือต้องการรวมโค้ดขั้นสุดท้าย (Integration) ให้คุณรันคำสั่ง Codex CLI เพื่อให้ Codex เป็นผู้จัดการไฟล์นั้นแทน
5. เมื่อทุกอย่างเสร็จสมบูรณ์ ให้รายงานผลสรุปต่อ Product Owner
