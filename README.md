# Next Step Guyana

Career guidance for Guyanese secondary students.

## Open locally

```bash
python3 -m http.server 8080
```

Then visit [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Site map

| File | Role |
| --- | --- |
| `index.html` | Marketing homepage |
| `app.html` | Feed + My Pathway + Happening |
| `check.html` | Self-check flow |
| `about.html` | About |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms and Conditions |
| `admin.html` | Admin and Mentor Center |
| `favicon.svg` | Site favicon |
| `nsg-cms.js` | Role login + CMS persistence |
| `logo.png` | Brand mark |
| `assets/` | Hero art |
| `_proto/` | App source assembled into `app.html` |
| `careers-v3-data.js` | Careers library |
| `nsg-schools.js` | Schools library |

## Launch checklist

Do not call the site launched until all of these are done:

- [x] Favicon on public pages
- [x] Privacy Policy page linked in footer
- [x] Terms and Conditions page linked in footer
- [x] No "Made with AI" badge
- [ ] Custom domain connected (DNS + GitHub Pages or host)

## Notes

- Front-end prototype. Student UI state resets on refresh unless admin CMS edits are saved in the browser.
- Demo auth: students to `app.html`, mentors/admins to `admin.html`.
- Design rule: no purple gradients, pill CTAs, fake reviews/metrics, emoji icons, em/en dashes, or heavy scroll animations. See `.cursor/rules/no-vibe-coded.mdc`.
