import modelManifest from './model-manifest.json';

export async function onRequest(context) {
  const models = await Promise.all(
    modelManifest.map(async (modelFile) => {
      const model = await import(`../../workers-ai-models/${modelFile}`);
      return model.default;
    })
  );

  return new Response(JSON.stringify({ models }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
