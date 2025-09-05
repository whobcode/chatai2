/**
 * @file This file handles the API communication for the chat application,
 * including fetching models, sending requests, and processing responses.
 * It also manages user settings like the host address and system prompt.
 */

var rebuildRules = undefined;
// This code is for a Chrome extension that modifies request headers to handle CORS.
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
  /**
   * Rebuilds the declarativeNetRequest rules for a Chrome extension to modify headers.
   * This is used to set the Origin header for requests to the Abacus.ai API.
   * @param {string} domain - The domain to set as the Origin.
   */
  rebuildRules = async function (domain) {
    const domains = [domain];
    /** @type {chrome.declarativeNetRequest.Rule[]} */
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

// The host address for the backend API.
// By default, this is the same origin as the frontend.
var api_host = localStorage.getItem("host-address");
const hostAddressInput = document.getElementById("host-address");
if (!api_host) {
  api_host = location.origin;
} else {
  hostAddressInput.value = api_host;
}
hostAddressInput.setAttribute("placeholder", api_host);

// Initialize the system prompt from local storage.
const system_prompt = localStorage.getItem("system-prompt");
if (system_prompt) {
  document.getElementById("system-prompt").value = system_prompt;
}

if (rebuildRules) {
  rebuildRules(api_host);
}

/**
 * Sets the host address from the input field, saves it to local storage,
 * and repopulates the models list.
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
 * Sets the system prompt from the input field and saves it to local storage.
 */
function setSystemPrompt() {
  const systemPrompt = document.getElementById("system-prompt").value;
  localStorage.setItem("system-prompt", systemPrompt);
}

/**
 * Fetches the list of available models from the API.
 * @returns {Promise<object>} A promise that resolves to the JSON response from the API.
 */
async function getModels() {
  const response = await fetch(`${api_host}/api/tags`);
  const data = await response.json();
  return data;
}

/**
 * Sends a POST request to the API with the chat data.
 * @param {object} data - The data to send in the request body.
 * @param {AbortSignal} signal - The abort signal to allow for request cancellation.
 * @returns {Promise<Response>} A promise that resolves to the fetch Response object.
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

/**
 * Processes a streaming response from the server.
 * @param {Response} response - The response object from the fetch request.
 * @param {function} callback - A callback function to process each JSON object from the stream.
 */
async function getResponse(response, callback) {
  const data = await response.json();
  callback(data);
}
