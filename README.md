<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RwNiA-VxeEcg2JVk2-yXI-DNvHbfM40c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the environment variables in [.env.local](.env.local):
   - `GEMINI_API_KEY` - Your Gemini API key (not exposed to client)
   - `VITE_PUBLIC_API_URL` - GraphQL API endpoint (exposed to client)
3. Run the app:
   `npm run dev`

## Environment Variables

This project uses Vite's environment variable system. Important notes:

- Only variables prefixed with `VITE_` are exposed to client-side code
- Server-side secrets should NOT be prefixed with `VITE_` to prevent exposure
- For different environments, you can create specific files:
  - `.env` - loaded in all cases
  - `.env.local` - loaded in all cases, ignored by git
  - `.env.development`, `.env.production` - environment-specific settings

> **Warning:** Never expose sensitive credentials like API keys that should remain server-side with the `VITE_` prefix.
