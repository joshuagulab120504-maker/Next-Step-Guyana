# Next Step Guyana

Career guidance for Guyanese secondary students.

## Open locally

```bash
python3 -m http.server 8080
```

Then visit the web site at [http://127.0.0.1:8080/](http://127.0.0.1:8080/) or the app at [http://127.0.0.1:8080/app.html](http://127.0.0.1:8080/app.html).

## Two products

| Product | Entry | Opening |
| --- | --- | --- |
| Web | `index.html` | Art marketing homepage |
| App | `app.html` | Logo splash, then What's Steppin'. No login. |

They share the same feed, pathway, and sessions. The app header stays inside the app and does not send people back to the art page.

## Site map

| File | Role |
| --- | --- |
| `index.html` | Web marketing homepage |
| `app.html` | App: splash, then Feed + My Pathway + Happening |
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
