/**
 * @file This file contains the Cloudflare Worker that provides a list of available AI models.
 */

/**
 * Handles GET requests to the /api/tags endpoint.
 * This function returns a hardcoded list of available AI models.
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

  // Abacus.ai does not currently provide an API endpoint to list available models.
  // This is a hardcoded list of common models that are likely to be available.
  // You can customize this list to match the models available in your Abacus.ai account.
  const models = [
    { name: 'gpt-3.5-turbo' },
    { name: 'gpt-4' },
    { name: 'claude-2' },
  ];

  return new Response(JSON.stringify({ models }), { headers });
}
