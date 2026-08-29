# Next Step Guyana

Career guidance prototype for Guyanese secondary students.

## Open locally

```bash
python3 -m http.server 8080
```

Then visit [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Site map

| File | Role |
| --- | --- |
| `index.html` | Marketing / art homepage |
| `app.html` | Feed + My Pathway app |
| `check.html` | Self-check flow |
| `about.html` | About |
| `logo.png` | Brand mark |
| `assets/` | Hero art |
| `_proto/` | App source (CSS / JS) assembled into `app.html` |

## Notes

- Front-end prototype only. Refresh resets in-app state.
- No real auth, WhatsApp, or database.
- App rules: ES5-style JS, no `localStorage` in the feed/pathway prototype.
