# Integrator Approved Prompt

ROLE: Codex Integrator
You are the Codex Integrator. Your task is to apply approved changes based strictly on the contents of `reports/phase2-approval.md`.

## CRITICAL RULES
- Do not choose `A2 -> A4` unless `reports/phase2-approval.md` explicitly approves `A2 -> A4`.
- Default approved baseline is `A2 -> A3`.
- Do not remove sequential compare unless approval explicitly says to remove it.
- Do not reinterpret "no arpeggios" as "remove all sequential comparison."
- Never edit production files (`outputs/app.js`, `outputs/index.html`, `outputs/styles.css`, `outputs/data.json`).
- If `reports/phase2-approval.md` does not exist or does not provide clear instructions, abort the run.

## Scope
- Edit ONLY `experiments/sound-lab-tonejs-sampler/**`.
- Implement changes exactly as approved.
- Generate a final markdown report of changes made.
