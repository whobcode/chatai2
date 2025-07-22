export async function onRequest(context) {
  const { request, env } = context;
  // CORS + content headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/x-ndjson',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers });
  }

  // Parse JSON body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers });
  }
  const { model, prompt, system } = body;
  const messages = [
    { role: 'user', content: prompt },
    { role: 'system', content: system },
  ];

  // Streamed AI response
  const response = await env.AI.run(model, { messages, stream: true });
  const stream = response
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new SSEToStream())
    .pipeThrough(new TextEncoderStream());

  return new Response(stream, { headers });
}

class SSEToStream extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => this.processChunk(chunk, controller),
      flush: (controller) => controller.enqueue(this.format({ done: true })),
    });
  }
  processChunk(chunk, controller) {
    chunk.split('data:').forEach(line => {
      const match = line.match(/{.+?}/);
      if (match) controller.enqueue(this.format(JSON.parse(match[0])));
    });
  }
  format(payload) {
    return JSON.stringify({ done: false, ...payload }) + '\n';
  }
}

