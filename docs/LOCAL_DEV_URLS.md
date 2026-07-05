# Local Dev URLs

Assume Live Server root is the project root `/`.

## Current URLs

- Main app: `/outputs/index.html`
- Week0 Rev2 prototype: `/outputs/week0-rev2/index.html`
- Month2 Week5 prototype: `/prototypes/month2-week5/index.html`
- Month2 Week6 prototype: `/prototypes/month2-week6/index.html`
- Month2 Week7 prototype: `/prototypes/month2-week7/index.html`

## Live Server Root Warning

If Live Server root is set to `/outputs`, then `/outputs/index.html` will not work because `/outputs` is already the server root.

In that case, the main app becomes:

- `/index.html`

## Prototype Path Warning

Some folders may contain duplicate or stale prototype copies. Always verify the URL before assuming a UI element disappeared.

Current note: the Week0 compact top Metronome bar still exists in the correct Week0 path:

- `/outputs/week0-rev2/index.html`

The apparent missing bar was caused by opening the wrong path.

Current note: Month2 Week6 prototype is frozen at:

- `/prototypes/month2-week6/index.html`

Current note: Month2 Week7 prototype is frozen at:

- `/prototypes/month2-week7/index.html`

Month 2 Orientation Rule v2: Fretboard Maps now match TAB-style orientation with string 1 / High e on top and string 6 / Low E on bottom. Standard TAB was not changed.
