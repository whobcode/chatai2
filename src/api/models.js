/**
 * Fetches available models from both Ollama and Cloudflare AI
 * This endpoint is an alias for /api/tags for backwards compatibility
 */
import { onRequest as getTagsModels } from './tags.js';

export async function onRequest(context) {
  // Simply delegate to the tags endpoint for unified model listing
  return getTagsModels(context);
}
