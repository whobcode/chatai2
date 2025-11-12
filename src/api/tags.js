/**
 * @file Provides a unified list of available models from both Ollama and Cloudflare AI
 */

// Import Cloudflare AI models catalog
import { onRequest as getCloudflareModels } from './cloudflare-models.js';

/**
 * Handles GET requests to the /api/tags endpoint.
 * Returns models from both Ollama and Cloudflare AI providers.
 *
 * @param {object} context - The Cloudflare Pages context object.
 * @returns {Response} A JSON response containing the unified list of models.
 */
export async function onRequest(context) {
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
    const allModels = [];

    // Fetch Ollama models
    try {
      const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (ollamaResponse.ok) {
        const ollamaData = await ollamaResponse.json();
        const ollamaModels = ollamaData.models.map(model => ({
          name: model.name,
          model: model.model || model.name,
          size: model.size,
          modified_at: model.modified_at,
          details: model.details,
          task: { name: 'Text Generation', id: 'text-generation' },
          description: model.details?.family || model.name,
          provider: 'ollama'
        }));
        allModels.push(...ollamaModels);
      }
    } catch (ollamaError) {
      console.warn('Failed to fetch Ollama models:', ollamaError.message);
      // Continue even if Ollama is unavailable
    }

    // Fetch Cloudflare AI models
    try {
      const cfResponse = await getCloudflareModels(context);
      if (cfResponse.ok) {
        const cfData = await cfResponse.json();
        allModels.push(...cfData.models);
      }
    } catch (cfError) {
      console.warn('Failed to fetch Cloudflare models:', cfError.message);
    }

    // If no models available from either provider, return error
    if (allModels.length === 0) {
      throw new Error('No models available from any provider');
    }

    return new Response(JSON.stringify({ models: allModels }), { headers });
  } catch (error) {
    console.error('Failed to fetch models:', error);

    return new Response(
      JSON.stringify({
        models: [],
        error: `Failed to fetch models: ${error.message}`
      }),
      {
        status: 500,
        headers,
      }
    );
  }
}
