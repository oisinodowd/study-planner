# Smart Study Planner Backend

This backend server provides a secure bridge between the frontend application and the Google Gemini API.

## 1. Prerequisites

- [Node.js](https://nodejs.org/) installed (version 18.x or higher recommended).
- A Google Gemini API Key.

## 2. Getting Your Gemini API Key

1.  Visit the [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click "**Create API key**".
3.  **Important:** Copy the generated key. This is a secret, do not share it or commit it to version control.

## 3. Setup

1.  **Install Dependencies:**
    Open a terminal inside this `backend` directory and run:
    ```bash
    npm install
    ```

2.  **Create Environment File:**
    Make a copy of the `.env.example` file and name it `.env`.

3.  **Add Your API Key:**
    Open the new `.env` file and replace `YOUR_API_KEY_HERE` with the secret API key you generated in Google AI Studio. The line should look like this:
    ```
    GEMINI_API_KEY=AIza...your...key...
    ```

## 4. Running the Server

1.  **Start the server:**
    From inside this `backend` directory, run:
    ```bash
    npm start
    ```
2.  The server should now be running on `http://localhost:3001`. The frontend application will communicate with this server.
