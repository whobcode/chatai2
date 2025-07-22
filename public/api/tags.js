
export async function onRequest(context) {
  // Common CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Your Ollama models list
  const models = [
    { name: '@cf/meta/llama-3.1-8b-instruct' },
    { name: '@hf/mistral/mistral-7b-instruct-v0.2' },
    { name: '@cf/microsoft/phi-2' },
    { name: '@cf/qwen/qwen1.5-14b-chat-awq' },
    { name: '@hf/google/gemma-7b-it' },
  ];

  return new Response(JSON.stringify({ models }), { headers });
}


/*export function onRequest(_context) {
  const models = [
    { name: "@cf/meta/llama-3.1-8b-instruct" },
    { name: "@hf/mistral/mistral-7b-instruct-v0.2" },
    { name: "@cf/microsoft/phi-2" },
    { name: "@cf/qwen/qwen1.5-14b-chat-awq" },
    { name: "@hf/google/gemma-7b-it" },
  ];
  return Response.json({ models });
}*/
