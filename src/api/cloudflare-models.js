/**
 * @file Provides complete Cloudflare Workers AI model catalog
 * Source: https://developers.cloudflare.com/workers-ai/models/
 * Last updated: 2025-01-10
 */

const CLOUDFLARE_AI_MODELS = [
  // Text Generation Models
  { id: '@cf/openai/gpt-oss-120b', name: 'GPT OSS 120B', task: 'Text Generation', description: 'Powerful reasoning and agentic tasks' },
  { id: '@cf/openai/gpt-oss-20b', name: 'GPT OSS 20B', task: 'Text Generation', description: 'Optimized for lower latency' },
  { id: '@cf/meta/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B', task: 'Text Generation', description: 'Multimodal mixture-of-experts' },
  { id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', name: 'Llama 3.3 70B Instruct (Fast)', task: 'Text Generation', description: 'Quantized for faster performance' },
  { id: '@cf/meta/llama-3.1-8b-instruct-fast', name: 'Llama 3.1 8B Instruct (Fast)', task: 'Text Generation', description: 'Optimized for multilingual dialogue' },
  { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', task: 'Text Generation', description: 'General purpose chat model' },
  { id: '@cf/meta/llama-3.2-1b-instruct', name: 'Llama 3.2 1B Instruct', task: 'Text Generation', description: 'Compact chat model' },
  { id: '@cf/meta/llama-3.2-3b-instruct', name: 'Llama 3.2 3B Instruct', task: 'Text Generation', description: 'Compact chat model' },
  { id: '@cf/meta/llama-3.2-11b-vision-instruct', name: 'Llama 3.2 11B Vision', task: 'Text Generation', description: 'Multimodal vision and text' },
  { id: '@cf/meta/llama-3-8b-instruct', name: 'Llama 3 8B Instruct', task: 'Text Generation', description: 'General purpose chat model' },
  { id: '@cf/meta/llama-3-8b-instruct-awq', name: 'Llama 3 8B Instruct (AWQ)', task: 'Text Generation', description: 'Quantized version' },
  { id: '@cf/meta/llama-3.1-8b-instruct-awq', name: 'Llama 3.1 8B Instruct (AWQ)', task: 'Text Generation', description: 'Quantized version' },
  { id: '@cf/meta/llama-3.1-8b-instruct-fp8', name: 'Llama 3.1 8B Instruct (FP8)', task: 'Text Generation', description: 'FP8 quantized' },
  { id: '@cf/meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', task: 'Text Generation', description: 'Large chat model' },
  { id: '@cf/meta/llama-guard-3-8b', name: 'Llama Guard 3 8B', task: 'Text Generation', description: 'Safety classifier' },
  { id: '@cf/meta/llama-2-7b-chat-fp16', name: 'Llama 2 7B Chat (FP16)', task: 'Text Generation', description: 'Legacy chat model' },
  { id: '@cf/meta/llama-2-7b-chat-int8', name: 'Llama 2 7B Chat (INT8)', task: 'Text Generation', description: 'Legacy quantized' },
  { id: '@cf/meta-llama/meta-llama-3-8b-instruct', name: 'Meta Llama 3 8B', task: 'Text Generation', description: 'Official Meta release' },
  { id: '@cf/meta-llama/llama-2-7b-chat-hf-lora', name: 'Llama 2 7B LoRA', task: 'Text Generation', description: 'LoRA fine-tuned' },
  { id: '@cf/ibm/granite-4.0-h-micro', name: 'Granite 4.0 Micro', task: 'Text Generation', description: 'IBM enterprise model' },
  { id: '@cf/mistral/mistral-small-3.1-24b-instruct', name: 'Mistral Small 3.1 24B', task: 'Text Generation', description: 'Mistral instruction model' },
  { id: '@cf/mistral/mistral-7b-instruct-v0.2', name: 'Mistral 7B v0.2', task: 'Text Generation', description: 'Mistral 7B instruction' },
  { id: '@cf/mistral/mistral-7b-instruct-v0.2-lora', name: 'Mistral 7B v0.2 LoRA', task: 'Text Generation', description: 'LoRA fine-tuned' },
  { id: '@cf/mistral/mistral-7b-instruct-v0.1', name: 'Mistral 7B v0.1', task: 'Text Generation', description: 'Legacy Mistral' },
  { id: '@cf/qwen/qwq-32b', name: 'QwQ 32B', task: 'Text Generation', description: 'Qwen reasoning model' },
  { id: '@cf/qwen/qwen2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', task: 'Code Generation', description: 'Code-specialized' },
  { id: '@cf/qwen/qwen1.5-1.8b-chat', name: 'Qwen 1.5 1.8B Chat', task: 'Text Generation', description: 'Compact chat' },
  { id: '@cf/qwen/qwen1.5-0.5b-chat', name: 'Qwen 1.5 0.5B Chat', task: 'Text Generation', description: 'Ultra-compact' },
  { id: '@cf/qwen/qwen1.5-7b-chat-awq', name: 'Qwen 1.5 7B Chat (AWQ)', task: 'Text Generation', description: 'Quantized' },
  { id: '@cf/qwen/qwen1.5-14b-chat-awq', name: 'Qwen 1.5 14B Chat (AWQ)', task: 'Text Generation', description: 'Quantized' },
  { id: '@cf/deepseek/deepseek-r1-distill-qwen-32b', name: 'DeepSeek R1 Qwen 32B', task: 'Text Generation', description: 'Reasoning model' },
  { id: '@cf/google/gemma-3-12b-it', name: 'Gemma 3 12B IT', task: 'Text Generation', description: 'Google instruction model' },
  { id: '@cf/google/gemma-7b-it', name: 'Gemma 7B IT', task: 'Text Generation', description: 'Google instruction model' },
  { id: '@cf/google/gemma-7b-it-lora', name: 'Gemma 7B IT LoRA', task: 'Text Generation', description: 'LoRA fine-tuned' },
  { id: '@cf/google/gemma-2b-it-lora', name: 'Gemma 2B IT LoRA', task: 'Text Generation', description: 'Compact LoRA' },
  { id: '@cf/aisingapore/gemma-sea-lion-v4-27b-it', name: 'SEA-Lion Gemma 27B', task: 'Text Generation', description: 'Southeast Asian languages' },
  { id: '@cf/nousresearch/hermes-2-pro-mistral-7b', name: 'Hermes 2 Pro Mistral 7B', task: 'Text Generation', description: 'Enhanced Mistral' },
  { id: '@cf/microsoft/phi-2', name: 'Phi-2', task: 'Text Generation', description: 'Microsoft compact model' },
  { id: '@cf/defog/sqlcoder-7b-2', name: 'SQLCoder 7B v2', task: 'Code Generation', description: 'SQL generation' },
  { id: '@cf/fblgit/una-cybertron-7b-v2-bf16', name: 'UNA Cybertron 7B v2', task: 'Text Generation', description: 'Roleplay optimized' },
  { id: '@cf/tinyllama/tinyllama-1.1b-chat-v1.0', name: 'TinyLlama 1.1B', task: 'Text Generation', description: 'Ultra-compact' },
  { id: '@cf/thebloke/discolm-german-7b-v1-awq', name: 'DiscoLM German 7B', task: 'Text Generation', description: 'German language' },
  { id: '@cf/tiiuae/falcon-7b-instruct', name: 'Falcon 7B Instruct', task: 'Text Generation', description: 'TII instruction model' },
  { id: '@cf/openchat/openchat-3.5-0106', name: 'OpenChat 3.5', task: 'Text Generation', description: 'Open source chat' },
  { id: '@cf/nexusflow/starling-lm-7b-beta', name: 'Starling LM 7B', task: 'Text Generation', description: 'RLAIF trained' },

  // Text-to-Speech Models
  { id: '@cf/deepgram/aura-2-es', name: 'Aura 2 Spanish', task: 'Text-to-Speech', description: 'Spanish TTS' },
  { id: '@cf/deepgram/aura-2-en', name: 'Aura 2 English', task: 'Text-to-Speech', description: 'English TTS' },
  { id: '@cf/deepgram/aura-1', name: 'Aura 1', task: 'Text-to-Speech', description: 'Multilingual TTS' },
  { id: '@cf/myshell-ai/melotts', name: 'MeloTTS', task: 'Text-to-Speech', description: 'High-quality TTS' },

  // Automatic Speech Recognition
  { id: '@cf/deepgram/flux', name: 'Flux', task: 'Speech Recognition', description: 'Real-time ASR' },
  { id: '@cf/deepgram/nova-3', name: 'Nova 3', task: 'Speech Recognition', description: 'Latest Deepgram ASR' },
  { id: '@cf/openai/whisper-large-v3-turbo', name: 'Whisper Large v3 Turbo', task: 'Speech Recognition', description: 'Fast transcription' },
  { id: '@cf/openai/whisper-tiny-en', name: 'Whisper Tiny EN', task: 'Speech Recognition', description: 'Compact English' },
  { id: '@cf/openai/whisper', name: 'Whisper', task: 'Speech Recognition', description: 'General transcription' },

  // Text Embeddings
  { id: '@cf/baai/bge-m3', name: 'BGE M3', task: 'Text Embeddings', description: 'Multilingual embeddings' },
  { id: '@cf/baai/bge-large-en-v1.5', name: 'BGE Large EN v1.5', task: 'Text Embeddings', description: 'Large English embeddings' },
  { id: '@cf/baai/bge-small-en-v1.5', name: 'BGE Small EN v1.5', task: 'Text Embeddings', description: 'Compact embeddings' },
  { id: '@cf/baai/bge-base-en-v1.5', name: 'BGE Base EN v1.5', task: 'Text Embeddings', description: 'Balanced embeddings' },
  { id: '@cf/pfnet/plamo-embedding-1b', name: 'PLaMo Embedding 1B', task: 'Text Embeddings', description: 'Japanese embeddings' },
  { id: '@cf/google/embeddinggemma-300m', name: 'EmbeddingGemma 300M', task: 'Text Embeddings', description: 'Google embeddings' },

  // Text Classification
  { id: '@cf/baai/bge-reranker-base', name: 'BGE Reranker Base', task: 'Text Classification', description: 'Search reranking' },
  { id: '@cf/huggingface/distilbert-sst-2-int8', name: 'DistilBERT SST-2', task: 'Text Classification', description: 'Sentiment analysis' },

  // Text-to-Image
  { id: '@cf/black-forest-labs/flux-1-schnell', name: 'Flux 1 Schnell', task: 'Text-to-Image', description: 'Fast image generation' },
  { id: '@cf/leonardo/lucid-origin', name: 'Lucid Origin', task: 'Text-to-Image', description: 'Leonardo AI' },
  { id: '@cf/leonardo/phoenix-1.0', name: 'Phoenix 1.0', task: 'Text-to-Image', description: 'Leonardo AI' },
  { id: '@cf/stabilityai/stable-diffusion-xl-base-1.0', name: 'Stable Diffusion XL', task: 'Text-to-Image', description: 'High-quality images' },
  { id: '@cf/runwayml/stable-diffusion-v1-5-img2img', name: 'SD v1.5 Img2Img', task: 'Text-to-Image', description: 'Image transformation' },
  { id: '@cf/runwayml/stable-diffusion-v1-5-inpainting', name: 'SD v1.5 Inpainting', task: 'Text-to-Image', description: 'Image editing' },
  { id: '@cf/bytedance/stable-diffusion-xl-lightning', name: 'SDXL Lightning', task: 'Text-to-Image', description: 'Fast generation' },
  { id: '@cf/lykon/dreamshaper-8-lcm', name: 'DreamShaper 8 LCM', task: 'Text-to-Image', description: 'Artistic generation' },

  // Image-to-Text
  { id: '@cf/llava-hf/llava-1.5-7b-hf', name: 'LLaVA 1.5 7B', task: 'Image-to-Text', description: 'Vision language model' },
  { id: '@cf/unum/uform-gen2-qwen-500m', name: 'UForm Gen2 Qwen', task: 'Image-to-Text', description: 'Compact vision model' },

  // Image Classification
  { id: '@cf/microsoft/resnet-50', name: 'ResNet-50', task: 'Image Classification', description: 'Image classification' },

  // Object Detection
  { id: '@cf/facebook/detr-resnet-50', name: 'DETR ResNet-50', task: 'Object Detection', description: 'Object detection' },

  // Translation
  { id: '@cf/meta/m2m100-1.2b', name: 'M2M100 1.2B', task: 'Translation', description: 'Multilingual translation' },
  { id: '@cf/ai4bharat/indictrans2-en-indic-1B', name: 'IndicTrans2', task: 'Translation', description: 'Indian languages' },

  // Summarization
  { id: '@cf/facebook/bart-large-cnn', name: 'BART Large CNN', task: 'Summarization', description: 'Text summarization' },

  // Voice Activity Detection
  { id: '@cf/pipecat-ai/smart-turn-v2', name: 'Smart Turn v2', task: 'Voice Activity Detection', description: 'Turn detection' }
];

/**
 * Handles GET requests to fetch Cloudflare AI models
 */
export async function onRequest(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const models = CLOUDFLARE_AI_MODELS.map(model => ({
    name: model.id,
    model: model.id,
    description: model.description,
    task: { name: model.task, id: model.task.toLowerCase().replace(/\s+/g, '-') },
    provider: 'cloudflare',
    size: 0,
    modified_at: new Date().toISOString()
  }));

  return new Response(
    JSON.stringify({ models }),
    { headers }
  );
}
