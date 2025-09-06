/**
 * @file This file contains the main logic for the chat interface.
 * It handles user input, API requests, response handling, and chat history management.
 */

/**
 * A string containing FAQ information about connecting to the Abacus.ai API.
 * @type {string}
 */
const faqString = `
**How do I connect to the Abacus.ai API?**

This application is configured to connect to the Abacus.ai API by default. Ensure you have a valid API key and that the host address is set correctly. For more information, please refer to the [Abacus.ai API documentation](https://abacus.ai/help/api/ref/).
`;

/**
 * SVG icon for the copy-to-clipboard button.
 * @type {string}
 */
const clipboardIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>`;

/**
 * The base height of the text input box in pixels.
 * @type {number}
 */
const textBoxBaseHeight = 40; // This should match the default height set in CSS

// Configure the 'marked' library to disable deprecated features.
// see conversation here: https://github.com/markedjs/marked/issues/2793
marked.use({
  mangle: false,
  headerIds: false,
});

/**
 * Sets focus to the user input text area.
 */
function autoFocusInput() {
  const userInput = document.getElementById("user-input");
  userInput.focus();
}

/**
 * Updates the URL query string to include the selected model name.
 * @param {string} model - The name of the selected model.
 */
function updateModelInQueryString(model) {
  // make sure browser supports features
  if (window.history.replaceState && "URLSearchParams" in window) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("model", model);
    // replace current url without reload
    const newPathWithQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newPathWithQuery);
  }
}

/**
 * Fetches the available models from the API and populates the model selection dropdown.
 * It also sets the selected model based on the URL query string, if present.
 */
async function populateModels() {
  document
    .getElementById("send-button")
    .addEventListener("click", submitRequest);

  try {
    const data = await getModels();

    const selectElement = document.getElementById("model-select");

    // set up handler for selection
    selectElement.onchange = () =>
      updateModelInQueryString(selectElement.value);

    const modelsByTask = data.models.reduce((acc, model) => {
      const taskName = model.task.name || 'Other';
      if (!acc[taskName]) {
        acc[taskName] = [];
      }
      acc[taskName].push(model);
      return acc;
    }, {});

    for (const taskName in modelsByTask) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = taskName;
      modelsByTask[taskName].forEach((model) => {
        const option = document.createElement("option");
        option.value = model.name;
        option.innerText = model.name;
        option.title = model.description;
        optgroup.appendChild(option);
      });
      selectElement.appendChild(optgroup);
    }

    // select option present in url parameter if present
    const queryParams = new URLSearchParams(window.location.search);
    const requestedModel = queryParams.get("model");
    // update the selection based on if requestedModel is a value in options
    if (
      [...selectElement.options].map((o) => o.value).includes(requestedModel)
    ) {
      selectElement.value = requestedModel;
    }
    // otherwise set to the first element if exists and update URL accordingly
    else if (selectElement.options.length) {
      selectElement.value = selectElement.options[0].value;
      updateModelInQueryString(selectElement.value);
    }
  } catch (error) {
    // Display an error modal if communication with the API fails.
    document.getElementById("errorText").innerHTML = DOMPurify.sanitize(
      marked.parse(
        `llm-chat was unable to communitcate with Abacus.ai due to the following error:\n\n` +
          `\`\`\`${error.message}\`\`\`\n\n---------------------\n` +
          faqString,
      ),
    );
    let modal = new bootstrap.Modal(document.getElementById("errorModal"));
    modal.show();
  }
}

/**
 * Adjusts the bottom padding of the chat container to match the height of the input area.
 */
function adjustPadding() {
  const inputBoxHeight = document.getElementById("input-area").offsetHeight;
  const scrollWrapper = document.getElementById("scroll-wrapper");
  scrollWrapper.style.paddingBottom = `${inputBoxHeight + 15}px`;
}

// Observe changes in the input area's size and adjust padding accordingly.
const autoResizePadding = new ResizeObserver(() => {
  adjustPadding();
});
autoResizePadding.observe(document.getElementById("input-area"));

/**
 * Gets the value of the selected model from the dropdown.
 * @returns {string} The selected model name.
 */
function getSelectedModel() {
  return document.getElementById("model-select").value;
}

//--- Auto-scroll functionality ---//
const scrollWrapper = document.getElementById("scroll-wrapper");
let isAutoScrollOn = true;

// Automatically scroll to the bottom of the chat when a new message is added.
const autoScroller = new ResizeObserver(() => {
  if (isAutoScrollOn) {
    scrollWrapper.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});

// Disable auto-scroll when the user scrolls up, and re-enable it when they scroll to the bottom.
let lastKnownScrollPosition = 0;
let ticking = false;
document.addEventListener("scroll", (event) => {
  // if user has scrolled up and autoScroll is on we turn it off
  if (!ticking && isAutoScrollOn && window.scrollY < lastKnownScrollPosition) {
    window.requestAnimationFrame(() => {
      isAutoScrollOn = false;
      ticking = false;
    });
    ticking = true;
  }
  // if user has scrolled nearly all the way down and autoScroll is disabled, re-enable
  else if (
    !ticking &&
    !isAutoScrollOn &&
    window.scrollY > lastKnownScrollPosition && // make sure scroll direction is down
    window.scrollY >=
      document.documentElement.scrollHeight - window.innerHeight - 30 // add 30px of space--no need to scroll all the way down, just most of the way
  ) {
    window.requestAnimationFrame(() => {
      isAutoScrollOn = true;
      ticking = false;
    });
    ticking = true;
  }
  lastKnownScrollPosition = window.scrollY;
});

/**
 * Handles the submission of a user's chat message.
 * It sends the request to the API and processes the response.
 */
async function submitRequest() {
  document.getElementById("chat-container").style.display = "block";

  const input = document.getElementById("user-input").value;
  if (!input.trim()) return; // Do not send empty messages

  const selectedModel = getSelectedModel();
  const context = document.getElementById("chat-history").context;
  const systemPrompt = document.getElementById("system-prompt").value;
  const data = {
    model: selectedModel,
    prompt: input,
    context: context,
    system: systemPrompt,
  };

  // Create and display the user's message
  let chatHistory = document.getElementById("chat-history");
  let userMessageDiv = document.createElement("div");
  userMessageDiv.className = "mb-2 user-message";
  userMessageDiv.innerText = input;
  chatHistory.appendChild(userMessageDiv);

  // Create a container for the AI's response, including a spinner
  let responseDiv = document.createElement("div");
  responseDiv.className = "response-message mb-2 text-start";
  responseDiv.style.minHeight = "3em";
  let spinner = document.createElement("div");
  spinner.className = "spinner-border text-light";
  spinner.setAttribute("role", "status");
  responseDiv.appendChild(spinner);
  chatHistory.appendChild(responseDiv);

  // Create a "Stop" button to allow the user to cancel the request
  let interrupt = new AbortController();
  let stopButton = document.createElement("button");
  stopButton.className = "btn btn-danger";
  stopButton.innerHTML = "Stop";
  stopButton.onclick = (e) => {
    e.preventDefault();
    interrupt.abort("Stop button pressed");
  };
  const sendButton = document.getElementById("send-button");
  sendButton.insertAdjacentElement("beforebegin", stopButton);

  // Observe the response container to trigger auto-scrolling
  autoScroller.observe(responseDiv);

  try {
    const response = await postRequest(data, interrupt.signal);

    // Check for a non-ok response and handle it
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    // remove spinner after first response
    spinner.remove();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep the last partial line in the buffer

      for (const line of lines) {
        if (line.trim() === "") continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            fullResponse += parsed.response;
            responseDiv.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
          }
          if (parsed.context) {
            chatHistory.context = parsed.context;
          }
        } catch (e) {
          console.error("Failed to parse JSON line:", line, e);
        }
      }
    }

    // Add the "Copy" button after the stream is complete
    let copyButton = document.createElement("button");
    copyButton.className = "btn btn-secondary copy-button";
    copyButton.innerHTML = clipboardIcon;
    copyButton.onclick = () => {
      navigator.clipboard
        .writeText(fullResponse)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    };
    responseDiv.appendChild(copyButton);

  } catch (error) {
    // Handle abort errors silently
    if (error.name !== "AbortError") {
      console.error("Error fetching response:", error);
      responseDiv.innerHTML = `Error: ${error.message}`;
    }
  } finally {
    stopButton.remove();
    // Ensure spinner is removed in all cases (e.g., if an error occurs before the first chunk)
    if (spinner.parentNode) {
      spinner.remove();
    }
  }

  // Clear the user input field
  const element = document.getElementById("user-input");
  element.value = "";
  $(element).css("height", textBoxBaseHeight + "px");
}

/**
 * Event listener for the user input field to submit on Ctrl+Enter or Cmd+Enter.
 */
document.getElementById("user-input").addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    submitRequest();
  }
});

/**
 * Initializes the application when the window loads.
 * Sets up event listeners and populates initial data.
 */
window.onload = () => {
  updateChatList();
  populateModels();
  adjustPadding();
  autoFocusInput();

  document.getElementById("delete-chat").addEventListener("click", deleteChat);
  document.getElementById("new-chat").addEventListener("click", startNewChat);
  document.getElementById("saveName").addEventListener("click", saveChat);
  document
    .getElementById("chat-select")
    .addEventListener("change", loadSelectedChat);
  document
    .getElementById("host-address")
    .addEventListener("change", setHostAddress);
  document
    .getElementById("system-prompt")
    .addEventListener("change", setSystemPrompt);
};

/**
 * Deletes the currently selected chat from local storage.
 */
function deleteChat() {
  const selectedChat = document.getElementById("chat-select").value;
  if (!selectedChat) return;
  localStorage.removeItem(selectedChat);
  startNewChat();
}

/**
 * Saves the current chat history to local storage with a user-provided name.
 */
function saveChat() {
  const chatName = document.getElementById("userName").value;

  // Close the modal
  const bootstrapModal = bootstrap.Modal.getInstance(
    document.getElementById("nameModal"),
  );
  bootstrapModal.hide();

  if (chatName === null || chatName.trim() === "") return;
  const history = document.getElementById("chat-history").innerHTML;
  const context = document.getElementById("chat-history").context;
  const systemPrompt = document.getElementById("system-prompt").value;
  const model = getSelectedModel();
  localStorage.setItem(
    chatName,
    JSON.stringify({
      history: history,
      context: context,
      system: systemPrompt,
      model: model,
    }),
  );
  updateChatList();
  document.getElementById("chat-select").value = chatName;
}

/**
 * Loads a selected chat from local storage into the chat interface.
 */
function loadSelectedChat() {
  const selectedChat = document.getElementById("chat-select").value;
  if (!selectedChat) return;
  const obj = JSON.parse(localStorage.getItem(selectedChat));
  document.getElementById("chat-history").innerHTML = obj.history;
  document.getElementById("chat-history").context = obj.context;
  document.getElementById("system-prompt").value = obj.system;
  document.getElementById("model-select").value = obj.model;
  updateModelInQueryString(obj.model);
  document.getElementById("chat-container").style.display = "block";
}

/**
 * Clears the current chat history and starts a new chat.
 */
function startNewChat() {
  document.getElementById("chat-history").innerHTML = "";
  document.getElementById("chat-history").context = null;
  document.getElementById("chat-container").style.display = "none";
  document.getElementById("chat-select").value = "";
}

/**
 * Updates the chat list dropdown with the saved chats from local storage.
 */
function updateChatList() {
  const chatList = document.getElementById("chat-select");
  const selectedChat = chatList.value;
  chatList.innerHTML =
    '<option value="" disabled>Select a chat</option>';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Filter out non-chat items
    if (key === "host-address" || key === "system-prompt") continue;
    const option = document.createElement("option");
    option.value = key;
    option.text = key;
    chatList.add(option);
  }
  // Restore the previous selection if it still exists
  if ([...chatList.options].map((o) => o.value).includes(selectedChat)) {
    chatList.value = selectedChat;
  } else {
    chatList.value = "";
  }
}

/**
 * Automatically adjusts the height of a textarea element based on its content.
 * @param {HTMLTextAreaElement} element - The textarea element to resize.
 */
function autoGrow(element) {
  const maxHeight = 200; // This should match the max-height set in CSS

  // Count the number of lines in the textarea based on newline characters
  const numberOfLines = $(element).val().split("\n").length;

  // Temporarily reset the height to auto to get the actual scrollHeight
  $(element).css("height", "auto");
  let newHeight = element.scrollHeight;

  // If content is one line, set the height to baseHeight
  if (numberOfLines === 1) {
    newHeight = textBoxBaseHeight;
  } else if (newHeight > maxHeight) {
    newHeight = maxHeight;
  }

  $(element).css("height", newHeight + "px");
}
