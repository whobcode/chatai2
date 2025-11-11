# ChatAI 2.0

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/whobcode/chatai2)

ChatAI 2.0 is a versatile and user-friendly web interface for interacting with large language models (LLMs) via [Ollama](https://ollama.ai/). This project provides a clean, responsive chat interface with features like chat history, model selection, and custom system prompts.

> 🍴 Forked from [https://github.com/ollama-ui/ollama-ui](https://github.com/ollama-ui/ollama-ui) with support for Ollama via cloudflared tunnels.

## Features

- **Ollama Integration**: Connects to your Ollama instance via cloudflared tunnel to provide chat functionality.
- **Model Selection**: Easily switch between different LLMs available through your Ollama installation.
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

This UI can connect to Ollama either locally or remotely via a cloudflared tunnel.

### Setup Ollama

1.  **Install and Run Ollama:**
    - Install Ollama from [ollama.ai](https://ollama.ai/)
    - Pull some models: `ollama pull llama2`, `ollama pull mistral`, etc.
    - Ensure Ollama is running: `ollama serve`

### Configuration

The Ollama URL is configured in `wrangler.toml` using the `OLLAMA_BASE_URL` variable:

**For Local Development:**
```toml
[vars]
OLLAMA_BASE_URL = "http://localhost:11434"
```

**For Remote/Production (via cloudflared tunnel):**
```toml
[vars]
OLLAMA_BASE_URL = "https://deep.hwmnbn.me"
```

**Note:** When using the remote tunnel URL, ensure Cloudflare's bot protection is disabled or set to allow server-to-server requests. For deployed Workers, you may need to use Cloudflare Access or disable the challenge for the `/api/*` paths.

### Run the application

```sh
npx wrangler dev
```

The **Model** dropdown will be automatically populated with models from your Ollama instance.

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
