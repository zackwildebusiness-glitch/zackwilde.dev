# zackwilde.dev

Static portfolio site for Zack Wilde.

## Files

- `index.html` - main portfolio page
- `styles.css` - responsive site styling
- `script.js` - sticky header polish
- `assets/` - project screenshots
- `Zack_Wilde_Resume.pdf` - downloadable resume
- `resume/` - committed source and script for regenerating the resume PDF
- `netlify.toml` - static publish config and headers
- `robots.txt` / `sitemap.xml` - search engine files

## Local Preview

Open `index.html` directly in a browser, or run a static server:

```bash
npx serve .
```

## Deployment

Deploy the `zackwilde.dev` folder as a static site. For Netlify, set:

- Publish directory: `.`
- Build command: empty

Then connect the custom domain `zackwilde.dev` in the hosting provider.

## Resume PDF

After resume copy changes, keep `Zack_Wilde_Resume.md` and `resume/resume.html` in sync, then regenerate the PDF:

```powershell
powershell -ExecutionPolicy Bypass -File resume/build.ps1
```
