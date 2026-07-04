# Guitar Companion

Thai-first personal guitar practice app for Month 1 rhythm foundation.

## Run

Open `outputs/index.html` in a browser, or serve the `outputs/` folder with any simple static server.

For Month 2+ preview data, use a local static server instead of opening the file directly with `file://`. Browser `fetch()` can block `data.json` from `file://`, especially on mobile.

Example:

```text
cd outputs
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Data Folder

Future curriculum data is lazy-loaded from `outputs/data.json`.

Keep `data.json` next to `index.html` when copying or serving the app:

```text
outputs/
  index.html
  app.js
  styles.css
  data.json
```

Month 1 still works if this JSON cannot be loaded. The app requests the file on boot so the data status line can confirm whether Month 2+ is available.
