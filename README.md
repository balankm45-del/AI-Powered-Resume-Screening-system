## GitHub Pages

This project can be hosted as a static site on GitHub Pages. The deployed frontend processes uploaded resumes in the browser with its deterministic scoring engine. The optional Gemini API endpoint requires the Express server and is not available on GitHub Pages.

### Deploy

1. Push the repository to GitHub.
2. In the repository, open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.

The site will be available at:

`https://<your-github-username>.github.io/AI-Powered-Resume-Screening-system/`

The Gemini key in `.env.example` is only a placeholder. Never commit a real API key; rotate any key that has been exposed.

