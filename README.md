# AP Songwriter

## 1. Overview

AP Songwriter is an AI-powered creative assistant designed to generate detailed song prompts for music AI platforms like Suno. It transforms a few simple user inputs—such as genre, mood, and theme—into a fully structured song format, complete with metadata, musical cues, and lyrics.

The application features a unique, retro-themed UI inspired by '90s operating systems, providing a fun and nostalgic user experience.

![AP Songwriter Screenshot](https://storage.googleapis.com/agent-tools-dev/doc-assets/ap-songwriter-screenshot.png)

---

## 2. Key Features

-   **Creative Input Fields**: Users provide core ideas through fields for Genre, Mood, Theme, Lyric Ideas, and Instrument/Style.
-   **Intelligent Auto-Generation**: Each creative field has a "dice" button that uses the Gemini AI to generate a cohesive suggestion based on the other filled-in fields.
-   **Detailed Suno-Ready Output**:
    -   **Style Description**: A concise phrase describing the song's style for Suno's input.
    -   **Exclude from Style**: A list of terms to exclude for a more refined generation.
    -   **Suno Lyrics Field**: The main, fully-formatted output containing metadata tags and lyrics, ready to be pasted into Suno.
-   **Lyric Style Control**: A slider allows users to define the lyrical style, from "Structured" (clear, narrative) to "Abstract" (metaphorical, impressionistic).
-   **Word Exclusion**: A dedicated field allows users to list words that the AI is strictly forbidden from using in the lyrics.
-   **Iterative Lyric Re-roll**: After a song is generated, users can provide new notes and "re-roll" only the lyrics, keeping the song's structure and metadata intact.
-   **Copy-to-Clipboard**: All output fields have convenient one-click copy buttons to streamline the user's workflow.
-   **Retro UI**: A vibrant, pixel-art aesthetic inspired by 90s OS designs, featuring a custom acid-yellow and magenta color scheme and the "Press Start 2P" font.

---

## 3. Tech Stack

-   **Frontend**: React (v19) with TypeScript
-   **AI Engine**: OpenAI API (`openai`) with GPT-4o-mini model
-   **Styling**: Tailwind CSS (JIT CDN) with a custom theme configured in `index.html`.
-   **Fonts**: Google Fonts (`Press Start 2P`)
-   **Module Loading**: The application uses ES Modules loaded directly from `esm.sh` via an `importmap` in `index.html`. This means there is no local `node_modules` folder or traditional build step (like Webpack or Vite) required to run the application.

---

## 4. Project Structure

The project is organized into a `components` directory for UI elements and several root files for core logic and configuration.

```
/
├── components/
│   ├── CopyableField.tsx   # UI for a text field with a copy button.
│   ├── Header.tsx          # The retro window title bar.
│   ├── Icon.tsx            # SVG icons used throughout the app.
│   ├── InputForm.tsx       # The main form for all user inputs.
│   ├── Loader.tsx          # Loading animation component.
│   ├── OutputDisplay.tsx   # Manages the display of AI-generated content.
│   └── SunoFormattedView.tsx # Renders the final Suno-formatted text block.
│
├── services/
│   ├── geminiService.ts    # Legacy Gemini service (deprecated)
│   └── openaiService.ts    # Handles all API calls to the OpenAI API.
│
├── App.tsx                 # The main application component, manages state and logic.
├── constants.ts            # Contains all the master prompts for the Gemini AI.
├── index.html              # The application's entry point, contains Tailwind config and importmaps.
├── index.tsx               # The React application root.
├── metadata.json           # Application metadata.
├── README.md               # This file.
└── types.ts                # TypeScript type definitions for the application.
```

---

## 5. Integration and Deployment Guide

This application is designed to be deployed as a static website. Follow these instructions to add it to a website.

### Step 1: Host the Files

Place all the files from this project (`index.html`, `App.tsx`, `components/`, etc.) onto a static web host or within a directory on an existing website.

### Step 2: Configure the API Key (Crucial)

The application requires an OpenAI API key to function. This key **must** be provided in a `.env` file at the project root.

- **Variable Name:** `OPENAI_API_KEY`
- **Example `.env.example` file:**
  ```
  OPENAI_API_KEY=your_actual_key_here
  ```

The application code will access this as `process.env.API_KEY` (mapped by Vite).

> **Security Note:**  
> The `.env` file is included in `.gitignore` and should never be committed to version control. Use `.env.example` as a template for sharing configuration requirements.

### Step 3: Access the Application

Once the files are hosted and the API key is configured, the application can be accessed by navigating to `index.html`. All dependencies are loaded from CDNs, so no `npm install` or build steps are required for the provided code to run.

## Local Development

To run the app locally:

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```
   cp .env.example .env
   # Then edit .env to add your actual key
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:5173/](http://localhost:5173/) in your browser.

