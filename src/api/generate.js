/**
 * @file This file contains the Cloudflare Worker that handles chat generation requests.
 * It receives a prompt from the client, calls the Abacus.ai API, and returns the response.
 */

/**
 * Handles POST requests to the /api/generate endpoint.
 * This function receives a prompt from the client, sends it to the Abacus.ai API,
 * and returns the response.
 *
 * @param {object} context - The Cloudflare Pages context object.
 * @param {Request} context.request - The incoming request object.
 * @param {object} context.env - The environment object, containing secrets like the API key.
 * @returns {Response} A JSON response with the AI-generated text.
 */
export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Ensure the request method is POST
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers });
  }

  // Parse the JSON body from the request
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers });
  }

  const { model, prompt } = body;

  const abacusApiUrl = 'https://api.abacus.ai/api/v0/createChatSession';
  const requestData = {
    message: prompt,
    llm_model: model || 'gpt-3.5-turbo',
  };

  try {
    const abacusResponse = await fetch(abacusApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': env.ABACUS_API_KEY,
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await abacusResponse.json();

    if (responseData.success) {
      // Adapt the response to the format the frontend expects
      const frontendResponse = {
        response: responseData.response,
        done: true,
        context: { session_id: responseData.chat_session_id },
      };
      return new Response(JSON.stringify(frontendResponse), { headers });
    } else {
      console.error('Abacus.ai API Error:', responseData.error);
      return new Response(JSON.stringify({ error: responseData.error }), {
        status: 500,
        headers,
      });
    }
  } catch (error) {
    console.error('Error calling Abacus.ai API:', error);
    return new Response(JSON.stringify({ error: 'Failed to call Abacus.ai API' }), {
      status: 500,
      headers,
    });
  }
}
