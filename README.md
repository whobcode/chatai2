# ChatAI 2.0

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/whobcode/chatai2)

ChatAI 2.0 is a versatile and user-friendly web interface for interacting with large language models (LLMs) via the [Abacus.ai API](https://abacus.ai/help/api/ref/). This project provides a clean, responsive chat interface with features like chat history, model selection, and custom system prompts.

> 🍴 Forked from [https://github.com/ollama-ui/ollama-ui](https://github.com/ollama-ui/ollama-ui) and retrofitted with support for Abacus.ai.

## Features

- **Abacus.ai Integration**: Connects to the Abacus.ai API to provide chat functionality.
- **Model Selection**: Easily switch between different LLMs available through Abacus.ai.
- **Chat History**: Save and load your conversations using your browser's local storage.
- **Custom System Prompts**: Tailor the AI's behavior by providing custom system prompts.
- **Responsive UI**: A clean and simple interface that works on both desktop and mobile devices.
- **Markdown Rendering**: Responses are rendered as Markdown, supporting rich text formatting.
- **Easy Deployment**: Deploy your own instance to Cloudflare with a single click.

## Setup and Development

To run the application locally for development, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/whobcode/chatai2.git
    cd chatai2
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Generate Cloudflare types (for development):**
    ```sh
    npx wrangler types
    ```

4.  **Start the development server:**
    ```sh
    npx wrangler dev
    ```

5.  **Open in your browser:**
    Navigate to [http://localhost:8788/](http://localhost:8788/) to use the application.

## Usage

This UI is configured to be used with the Abacus.ai API.

1.  **Get an Abacus.ai API Key:**
    - Sign up for an account at [abacus.ai](https://abacus.ai/).
    - Navigate to the API keys dashboard and generate a new API key.

2.  **Configure your API Key:**
    - Open the `wrangler.toml` file and replace the placeholder API key in the `[vars]` section with your own Abacus.ai API key.
    ```toml
    [vars]
    ABACUS_API_KEY = "your-api-key-goes-here"
    ```

3.  **Run the application:**
    - The application is pre-configured to use the Abacus.ai API.
    - The **Model** dropdown will be populated with a list of common models. You can customize this list in `src/api/tags.js`.

## Project Structure

The repository is organized into two main directories:

-   `src/`: Contains the source code for the Cloudflare Worker functions that act as the backend.
    -   `api/generate.js`: Handles the AI chat generation requests.
    -   `api/tags.js`: Provides the list of available models.
-   `public/`: Contains all the frontend assets, including the HTML, CSS, and client-side JavaScript.
    -   `index.html`: The main HTML file for the application.
    -   `chat.js`: The core JavaScript file for the chat interface logic.
    -   `api.js`: Handles communication with the backend API.
    -   `resources/`: Contains third-party libraries like Bootstrap and Marked.js.
