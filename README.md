# WearSense 🎨

Discover your perfect palette. WearSense is a smart style assistant that uses the Google Gemini API to provide personalized clothing color and style recommendations from a single photo.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgoogle-gemini-vignettes%2Freact-wearsense-pwa&env=API_KEY&envDescription=Your%20Google%20Gemini%20API%20Key&project-name=wearsense&repository-name=wearsense)

## ✨ Features

*   **🤖 AI-Powered Analysis:** Leverages the Google Gemini API to analyze a photo and identify key features like skin tone.
*   **🎨 Personalized Color Palettes:** Receive three custom color palettes (e.g., Power Colors, Neutral Basics, Accent Hues) tailored to you.
*   **👕 Smart Style Suggestions:** Get specific clothing recommendations (e.g., "Blazer in Emerald Green") appropriate for various occasions.
*   **⚡ Instant & Interactive:** A sleek, single-page application experience built with React and modern web standards.
*   **📱 PWA Ready:** Installable on your homescreen with offline support for a native-app feel.
*   **🎨 Beautifully Designed:** A clean, responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **AI:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Dependencies:** Served via [esm.sh](https://esm.sh/) (no `node_modules` or build step!)

## 🚀 Deploying to Vercel

Deploying WearSense to Vercel is the recommended way to get started. It's quick, easy, and free.

### One-Click Deploy

Click the "Deploy with Vercel" button at the top of this README or right here:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgoogle-gemini-vignettes%2Freact-wearsense-pwa&env=API_KEY&envDescription=Your%20Google%20Gemini%20API%20Key&project-name=wearsense&repository-name=wearsense)

You will be redirected to Vercel, where it will clone the repository and ask you to enter your **Gemini `API_KEY`** as an environment variable. After that, Vercel will handle the rest!

### Manual Deployment

1.  **Fork this repository** to your own GitHub account.
2.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New... > Project"**.
3.  **Import** your forked repository from GitHub.
4.  In the **"Configure Project"** screen:
    *   Vercel will automatically detect this as a static project. No changes are needed for the framework preset or build settings.
    *   Expand the **"Environment Variables"** section.
    *   Add a new variable with the name `API_KEY` and paste your Google Gemini API key as the value.
5.  Click **"Deploy"**. That's it! Your app will be live in a few moments.

## 📄 License

This project is licensed under the MIT License.
