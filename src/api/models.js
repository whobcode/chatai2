/**
 * Fetches available models from Ollama and/or Cloudflare Workers AI
 */
export async function onRequest(context) {
  const OLLAMA_BASE_URL = context.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const AI_PROVIDER = context.env.AI_PROVIDER || 'both';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    let allModels = [];

    // Fetch Ollama models
    if (AI_PROVIDER === 'ollama' || AI_PROVIDER === 'both') {
      try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
        if (response.ok) {
          const data = await response.json();
          const ollamaModels = data.models.map(model => ({
            name: model.name,
            model: model.model || model.name,
            size: model.size,
            modified_at: model.modified_at,
            details: model.details,
            provider: 'ollama',
            task: { name: 'Text Generation' }
          }));
          allModels = allModels.concat(ollamaModels);
        }
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
      }
    }

    // Add Cloudflare AI models
    if ((AI_PROVIDER === 'cloudflare' || AI_PROVIDER === 'both') && context.env.AI) {
      const cfModels = getCloudflareAIModels();
      allModels = allModels.concat(cfModels);
    }

    return new Response(JSON.stringify({ models: allModels }), { headers });
  } catch (error) {
    console.error('Failed to fetch models:', error);

    return new Response(
      JSON.stringify({
        models: [],
        error: `Failed to fetch models: ${error.message}`
      }),
      { status: 500, headers }
    );
  }
}

/**
 * Returns list of Cloudflare Workers AI text generation models
 */
function getCloudflareAIModels() {
  return [
    // Llama models
    { name: '@cf/meta/llama-3.1-8b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 3.1 8B Instruct' },
    { name: '@cf/meta/llama-3.1-70b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 3.1 70B Instruct' },
    { name: '@cf/meta/llama-3.2-1b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 3.2 1B Instruct' },
    { name: '@cf/meta/llama-3.2-3b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 3.2 3B Instruct' },
    { name: '@cf/meta/llama-3.2-11b-vision-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 3.2 11B Vision Instruct' },
    { name: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 3.3 70B Instruct (Fast)' },
    { name: '@cf/meta/llama-4-scout-17b-16e-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 4 Scout 17B Instruct' },
    { name: '@cf/meta/llama-2-7b-chat-fp16', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 2 7B Chat' },
    { name: '@cf/meta/llama-2-7b-chat-int8', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama 2 7B Chat (INT8)' },

    // Mistral models
    { name: '@cf/mistral/mistral-7b-instruct-v0.1', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Mistral 7B Instruct v0.1' },
    { name: '@cf/mistral/mistral-7b-instruct-v0.2', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Mistral 7B Instruct v0.2' },
    { name: '@cf/mistral/mistral-small-3.1-24b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Mistral Small 3.1 24B' },
    { name: '@hf/thebloke/mistral-7b-instruct-v0.1-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Mistral 7B Instruct AWQ' },
    { name: '@hf/thebloke/mistral-7b-instruct-v0.2-lora', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Mistral 7B Instruct LoRA' },

    // Qwen models
    { name: '@cf/qwen/qwen1.5-0.5b-chat', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Qwen 1.5 0.5B Chat' },
    { name: '@cf/qwen/qwen1.5-1.8b-chat', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Qwen 1.5 1.8B Chat' },
    { name: '@cf/qwen/qwen1.5-7b-chat-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Qwen 1.5 7B Chat AWQ' },
    { name: '@cf/qwen/qwen1.5-14b-chat-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Qwen 1.5 14B Chat AWQ' },
    { name: '@cf/qwen/qwen2.5-coder-32b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Qwen 2.5 Coder 32B' },
    { name: '@cf/qwen/qwq-32b', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Qwen QwQ 32B' },

    // DeepSeek models
    { name: '@hf/thebloke/deepseek-coder-6.7b-base-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'DeepSeek Coder 6.7B Base' },
    { name: '@hf/thebloke/deepseek-coder-6.7b-instruct-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'DeepSeek Coder 6.7B Instruct' },
    { name: '@cf/deepseek-ai/deepseek-math-7b-instruct', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'DeepSeek Math 7B' },
    { name: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'DeepSeek R1 Distill Qwen 32B' },

    // Gemma models
    { name: '@hf/google/gemma-7b-it', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Gemma 7B Instruct' },
    { name: '@cf/google/gemma-3-12b-it', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Gemma 3 12B Instruct' },

    // Other models
    { name: '@hf/nousresearch/hermes-2-pro-mistral-7b', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Hermes 2 Pro Mistral 7B' },
    { name: '@hf/thebloke/neural-chat-7b-v3-1-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Neural Chat 7B v3.1' },
    { name: '@hf/thebloke/openhermes-2.5-mistral-7b-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'OpenHermes 2.5 Mistral 7B' },
    { name: '@cf/microsoft/phi-2', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Phi-2' },
    { name: '@hf/thebloke/llamaguard-7b-awq', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'LlamaGuard 7B' },
    { name: '@cf/meta/llama-guard-3-8b', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Llama Guard 3 8B' },
    { name: '@cf/tinyllama/tinyllama-1.1b-chat-v1.0', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'TinyLlama 1.1B Chat' },
    { name: '@hf/nexusflow/starling-lm-7b-beta', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Starling LM 7B' },
    { name: '@cf/fblgit/una-cybertron-7b-v2-bf16', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'Una Cybertron 7B v2' },
    { name: '@cf/defog/sqlcoder-7b-2', provider: 'cloudflare', task: { name: 'Text Generation' }, description: 'SQLCoder 7B' }
  ];
}
