// ai.js — frontend helper replacing old api.js (keeps same surface)
// Respects previous functions: setHostAddress, setSystemPrompt, getModels, postRequest, getResponse

let SERVICE_KEY = window.__SERVICE_API_KEY__ || localStorage.getItem('SERVICE_API_KEY') || '';
let SYSTEM_PROMPT = localStorage.getItem('system-prompt') || '';

export function setSystemPrompt(text) {
  SYSTEM_PROMPT = text || '';
  localStorage.setItem('system-prompt', SYSTEM_PROMPT);
}

export function setServiceKey(k) {
  SERVICE_KEY = k || '';
  if (k) localStorage.setItem('SERVICE_API_KEY', k);
}

function workerUrl(path) {
  return path;
}

export async function getModels() {
  const r = await fetch(workerUrl('/api/models'), {
    headers: SERVICE_KEY ? { Authorization: `Bearer ${SERVICE_KEY}` } : {}
  });
  if (!r.ok) throw new Error(`models: ${r.status}`);
  return r.json(); // { models: [{name}] }
}

// data: { model, prompt, context, system, stream? }
export function postRequest(data, signal) {
  const messages = [];
  const sys = (data.system ?? SYSTEM_PROMPT).trim();
  if (sys) messages.push({ role: 'system', content: sys });
  if (data.context && typeof data.context === 'string') {
    messages.push({ role: 'system', content: `Context:\\n${data.context}` });
  }
  messages.push({ role: 'user', content: data.prompt });

  const body = {
    model: data.model,
    messages,
    stream: data.stream !== false
  };

  return fetch(workerUrl('/api/generate'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(SERVICE_KEY ? { Authorization: `Bearer ${SERVICE_KEY}` } : {})
    },
    body: JSON.stringify(body),
    signal
  });
}

export async function getResponse(response, callback) {
  if (!response.ok || !response.body) {
    callback({ response: `\\n**Error:** HTTP ${response.status}`, done: true });
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\\n');
    buf = lines.pop() || '';

    for (const line of lines) {
      const s = line.trim();
      if (!s || !s.startsWith('data:')) continue;
      const payload = s.slice(5).trim();
      if (payload === '[DONE]') { callback({ done: true }); continue; }
      try {
        const json = JSON.parse(payload);
        const choice = json.choices && json.choices[0];
        const delta = choice && choice.delta && choice.delta.content;
        if (typeof delta === 'string' && delta.length) {
          callback({ response: delta, done: false });
        }
        if (choice && choice.finish_reason && choice.finish_reason !== null) {
          callback({ done: true });
        }
      } catch (e) { /* ignore keepalives */ }
    }
  }
  if (buf.length) {
    try {
      const json = JSON.parse(buf.replace(/^data:\\s*/, ''));
      const choice = json.choices && json.choices[0];
      const delta = choice && choice.delta && choice.delta.content;
      if (typeof delta === 'string' && delta.length) {
        callback({ response: delta, done: false });
      }
    } catch {};
  }
  callback({ done: true });
}

// Optional LangChain route convenience
export async function translateViaLangChain({ text, language='italian', model='gpt-4o-mini', provider } = {}) {
  const r = await fetch(workerUrl('/lang/translate'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(SERVICE_KEY ? { Authorization: `Bearer ${SERVICE_KEY}` } : {})
    },
    body: JSON.stringify({ text, language, model, provider })
  });
  if (!r.ok) throw new Error(`translate: ${r.status}`);
  return r.json(); // { content }
}
