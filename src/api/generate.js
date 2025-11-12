/**
 * @file Handles chat generation requests via Ollama or Cloudflare AI
 */

/**
 * Handles POST requests to the /api/generate endpoint.
 * Supports both Ollama and Cloudflare Workers AI.
 *
 * @param {object} context - The Cloudflare Pages context object.
 * @returns {Response} A streaming response from the AI provider.
 */
export async function onRequest(context) {
  const OLLAMA_BASE_URL = context.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight OPTIONS request for CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const body = await context.request.json();

    // Automatically determine provider based on model ID format
    // Cloudflare models start with @cf/ or @hf/, everything else goes to Ollama
    const useCloudflare = body.model?.startsWith('@cf/') || body.model?.startsWith('@hf/');

    if (useCloudflare && context.env.AI) {
      // Use Cloudflare Workers AI
      return await handleCloudflareAI(context, body, headers);
    } else {
      // Use Ollama
      return await handleOllama(OLLAMA_BASE_URL, body, headers);
    }

  } catch (error) {
    console.error('Failed to generate response:', error);

    return new Response(
      JSON.stringify({ error: `Failed to generate response: ${error.message}` }),
      {
        status: 500,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Handles requests using Cloudflare Workers AI
 */
async function handleCloudflareAI(context, body, corsHeaders) {
  const messages = body.messages || [];

  // Extract system message if present
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  // Build prompt from messages
  let prompt = '';
  if (systemMessage) {
    prompt += `System: ${systemMessage.content}\n\n`;
  }
  for (const msg of userMessages) {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
  }
  prompt += 'Assistant: ';

  // Call Cloudflare AI
  const response = await context.env.AI.run(body.model, {
    prompt: prompt,
    stream: body.stream !== false
  });

  // Stream the response
  if (body.stream !== false) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    (async () => {
      try {
        if (response instanceof ReadableStream) {
          const reader = response.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Transform to chat format
            const chunk = {
              message: { role: 'assistant', content: value.response || value },
              done: false
            };
            await writer.write(encoder.encode(JSON.stringify(chunk) + '\n'));
          }
        } else {
          // Non-streaming response
          const chunk = {
            message: { role: 'assistant', content: response.response || response },
            done: true
          };
          await writer.write(encoder.encode(JSON.stringify(chunk) + '\n'));
        }
        await writer.close();
      } catch (error) {
        console.error('Streaming error:', error);
        await writer.abort(error);
      }
    })();

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } else {
    // Non-streaming response
    return new Response(JSON.stringify({
      message: { role: 'assistant', content: response.response || response },
      done: true
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Handles requests using Ollama
 */
async function handleOllama(baseUrl, body, corsHeaders) {
  const ollamaRequest = {
    model: body.model,
    messages: body.messages || [],
    stream: body.stream !== false,
    options: body.options || {}
  };

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ollamaRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.status} ${errorText}`);
  }

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-AI-Provider');

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
