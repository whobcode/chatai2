/**
 * @file This file contains the Cloudflare Worker that provides a list of available AI models.
 */

/**
 * Handles GET requests to the /api/tags endpoint.
 * This function dynamically fetches a list of available text-generation models
 * from the official Cloudflare documentation repository.
 * If the fetch fails, it returns a hardcoded fallback list.
 *
 * @param {object} context - The Cloudflare Pages context object.
 * @returns {Response} A JSON response containing the list of models.
 */
export async function onRequest(context) {
  // Common CORS headers
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
    // The official list of models can be found at https://developers.cloudflare.com/workers-ai/models/
    // This JSON file is the source for that page, hosted in the Cloudflare documentation repo.
    const response = await fetch(
      "https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/content/workers-ai/models.json",
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch model list: ${response.statusText}`);
    }
    const modelData = await response.json();

    // The JSON file has a complex structure. We filter for 'text-generation' models
    // and map the result to the format expected by the frontend.
    const models = modelData
      .filter((model) => model.type === "text-generation")
      .map((model) => ({ name: model.name }));

    return new Response(JSON.stringify({ models }), { headers });
  } catch (error) {
    console.error("Failed to fetch or process model list:", error);

    // In case of an error (e.g., GitHub is down), return a hardcoded fallback list.
    const fallbackModels = [
      { name: 'gpt-3.5-turbo' },
      { name: 'gpt-4' },
      { name: 'claude-2' },
      { name: '@cf/meta/llama-2-7b-chat-fp16' },
      { name: '@cf/mistral/mistral-7b-instruct-v0.1' },
    ];

    return new Response(JSON.stringify({ models: fallbackModels, error: `Failed to fetch dynamic model list. Using fallback. Reason: ${error.message}` }), {
      status: 200, // Return 200 so the frontend can still use the fallback list
      headers,
    });
  }
}
