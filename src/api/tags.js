/**
 * @file Provides a list of available models from Ollama
 */

/**
 * Handles GET requests to the /api/tags endpoint.
 * Fetches available models from the Ollama instance.
 *
 * @param {object} context - The Cloudflare Pages context object.
 * @returns {Response} A JSON response containing the list of models.
 */
export async function onRequest(context) {
  // Use environment variable for Ollama URL, fallback to localhost
  const OLLAMA_BASE_URL = context.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request for CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // Fetch models from Ollama API
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform Ollama response to match expected format
    // Ollama returns: { models: [{name, model, modified_at, size, digest, details}] }
    const models = data.models.map(model => ({
      name: model.name,
      model: model.model || model.name,
      size: model.size,
      modified_at: model.modified_at,
      details: model.details,
      task: { name: 'Text Generation' },
      description: model.details?.family || model.name
    }));

    return new Response(JSON.stringify({ models }), { headers });
  } catch (error) {
    console.error('Failed to fetch models from Ollama:', error);

    // Return error response
    return new Response(
      JSON.stringify({
        models: [],
        error: `Failed to fetch models from Ollama: ${error.message}`
      }),
      {
        status: 500,
        headers,
      }
    );
  }
}
