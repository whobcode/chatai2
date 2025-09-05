const worker_base = (window.__WORKER_BASE__ || '') + '/v1';
const SERVICE_API_KEY = window.__SERVICE_API_KEY__ || '';


var ollama_host = localStorage.getItem("host-address");
const hostAddressInput = document.getElementById("host-address");
if (!ollama_host) {
  ollama_host = location.origin;
} else {
  hostAddressInput.value = ollama_host;
}
hostAddressInput.setAttribute("placeholder", ollama_host);

const ollama_system_prompt = localStorage.getItem("system-prompt");
if (ollama_system_prompt) {
  document.getElementById("system-prompt").value = ollama_system_prompt;
}
async function getModels() {
  const r = await fetch(`${worker_base}/models`, {
    headers: { Authorization: `Bearer ${SERVICE_API_KEY}` }
  });
  if (!r.ok) throw new Error(`models ${r.status}`);
  const j = await r.json();
  // Normalize to {models:[{name}]} for existing UI
  const models = Array.isArray(j?.data) ? j.data.map(m => ({ name: m.id })) : (j.models || []);
  return { models };
}
function postRequest(data, signal) {
  const model = data.model.includes(':') ? data.model : `ollama:${data.model}`;
  const body = {
    model,
    stream: true,
    messages: [
      data.system ? { role: 'system', content: data.system } : null,
      { role: 'user', content: data.prompt }
    ].filter(Boolean)
  };
  return fetch(`${worker_base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_API_KEY}`
    },
    body: JSON.stringify(body),
    signal
  });
}
async function getResponse(response, callback) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\\n\\n")) !== -1) {
      const chunk = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 2);
      if (!chunk) continue;
      const line = chunk.startsWith("data:") ? chunk.slice(5).trim() : chunk;
      if (line === "[DONE]") { callback({ done: true }); continue; }
      try {
        const json = JSON.parse(line);
        const choice = json?.choices?.[0];
        const delta = choice?.delta?.content ?? choice?.message?.content ?? "";
        if (delta) callback({ response: delta });
        if (choice?.finish_reason) callback({ done: true });
      } catch (_) {
        // ignore parse errors of keep-alives
      }
    }
  }
}
function setHostAddress() {
  const hostAddressField = document.getElementById("host-address");
  if (!hostAddressField) return;
  const host = hostAddressField.value.trim();
  if (host) {
    const base = host.endsWith('/') ? host.slice(0, -1) : host;
    window.__WORKER_BASE__ = base;
  }
}
