/**
 * @file Client-side API communication for the chat application
 * Handles fetching models, sending requests, and managing user settings
 */

var rebuildRules = undefined;
// Chrome extension support for CORS handling
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
  rebuildRules = async function (domain) {
    const domains = [domain];
    const rules = [
      {
        id: 1,
        condition: {
          requestDomains: domains,
        },
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "origin",
              operation: "set",
              value: `http://${domain}`,
            },
          ],
        },
      },
    ];
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((r) => r.id),
      addRules: rules,
    });
  };
}

// The host address for the backend API
var api_host = localStorage.getItem("host-address");
const hostAddressInput = document.getElementById("host-address");
if (!api_host) {
  api_host = location.origin;
} else {
  hostAddressInput.value = api_host;
}
hostAddressInput.setAttribute("placeholder", api_host);

// Initialize the system prompt from local storage
const system_prompt = localStorage.getItem("system-prompt");
if (system_prompt) {
  document.getElementById("system-prompt").value = system_prompt;
}

if (rebuildRules) {
  rebuildRules(api_host);
}

/**
 * Sets the host address and saves it to local storage
 */
function setHostAddress() {
  api_host = document.getElementById("host-address").value;
  localStorage.setItem("host-address", api_host);
  populateModels();
  if (rebuildRules) {
    rebuildRules(api_host);
  }
}

/**
 * Sets the system prompt and saves it to local storage
 */
function setSystemPrompt() {
  const systemPrompt = document.getElementById("system-prompt").value;
  localStorage.setItem("system-prompt", systemPrompt);
}

/**
 * Fetches the list of available models from the API
 * @returns {Promise<object>} Promise that resolves to the JSON response
 */
async function getModels() {
  const response = await fetch(`${api_host}/api/tags`);
  const data = await response.json();
  return data;
}

/**
 * Sends a POST request to the generate API endpoint
 * @param {object} data - The data to send in the request body
 * @param {AbortSignal} signal - The abort signal to allow for request cancellation
 * @returns {Promise<Response>} Promise that resolves to the fetch Response object
 */
function postRequest(data, signal) {
  const URL = `${api_host}/api/generate`;
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    signal: signal,
  });
}
