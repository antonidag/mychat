(function () {
  // Get the current script tag
  const scriptTag = document.currentScript;
  // Fetch data attributes from the script tag
  const chatName = scriptTag.getAttribute('chat-title');
  const collection = scriptTag.getAttribute('data-collection');

  createStyleSheet();
  createHTMLWidget(chatName);

  // Add event listeners
  const chatInput = document.getElementById('chat-input');
  const chatSubmit = document.getElementById('chat-submit');
  const chatMessages = document.getElementById('chat-messages');
  const chatBubble = document.getElementById('chat-bubble');
  const chatPopup = document.getElementById('chat-popup');
  const closePopup = document.getElementById('close-popup');

  chatSubmit.addEventListener('click', function () {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';
    onUserRequest(message);
  });

  chatInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      chatSubmit.click();
    }
  });

  chatBubble.addEventListener('click', function () {
    togglePopup();
  });

  closePopup.addEventListener('click', function () {
    togglePopup();
  });

  function togglePopup() {
    chatPopup.classList.toggle('hidden');
    if (!chatPopup.classList.contains('hidden')) {
      chatPopup.style.display = 'flex';
      chatInput.focus();
    } else {
      chatPopup.style.display = 'none';
    }
  }

  async function onUserRequest(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-container user';
    messageElement.innerHTML = `
      <div class="message">
        ${message}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';

    const body = await promptAI(message);
    const guidID = generateUUID()
    reply(body.response, guidID)
  }

  function reply(message, guidID) {
    const replyElement = document.createElement('div');
    replyElement.className = 'message-container reply';
    replyElement.innerHTML = `
      <div class="message reply" id="${guidID}">
        ${message}
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
})();

async function promptAI(message) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "model": "qwen2:0.5b",
    "prompt": message,
    "stream": false
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const response = (await fetch("http://localhost:11434/api/generate", requestOptions));
  const body = await response.json();
  return body;
}

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

//#region CSS
function createStyleSheet() {
  const style = document.createElement('style');
  style.innerHTML = `
 .hidden {
    display: none;
}
#chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
}
#chat-bubble {
    width: 4rem;
    height: 4rem;
    /*background-color: #C3C3C3; *//* Light gray */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.875rem;
    z-index: 1000;
    transition: transform 0.3s;
}
#chat-bubble:hover {
    transform: scale(1.1);
}
#chat-bubble svg {
    width: 2.5rem;
    height: 2.5rem; 
    color: #000; /* Black */
}
#chat-popup {
    width: 40vh;
    height: 70vh;
    max-height: 70vh;
    transition: all 0.3s;
    overflow: hidden;
    display: none; /* Ensure the chat popup is initially hidden */
    position: absolute;
    bottom: 70px;
    right: -10px;
    background-color: #C3C3C3;
    border: 2px solid #808080;
    /*box-shadow: 2px 2px 5px #808080, -2px -2px 5px #FFFFFF;* /* Beveled effect */
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    font-size: 0.875rem;
    z-index: 1001;
}
#chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem; /* Tailwind p-4 */
    background-color: #000080; /* Navy blue */
    color: #fff; /* Tailwind text-white */
    border-bottom: 2px solid #808080; /* Dark gray */
    font-family: 'MS Sans Serif', 'Arial', sans-serif; /* Windows 95 font */
}
#chat-header h3 {
    margin: 0;
    font-size: 1.125rem; /* Tailwind text-lg */
}
#close-popup {
    background: transparent;
    border: none;
    color: #fff; /* Tailwind text-white */
    cursor: pointer;
}
#close-popup svg {
    height: 1.5rem; /* Tailwind h-6 */
    width: 1.5rem; /* Tailwind w-6 */
}
#chat-messages {
    flex: 1;
    padding: 0.5rem; /* Tailwind p-4 */
    overflow-y: auto;
    background-color: #008282; /* Windows Green */
    font-family: 'MS Sans Serif', 'Arial', sans-serif; /* Windows 95 font */
    border-top: 2px solid #808080; /* Dark gray */
}
#chat-input-container {
    padding: 0.5rem 1rem; /* Tailwind p-4 */
    border-top: 2px solid #808080; /* Dark gray */
    background-color: #C3C3C3; /* Light gray */
}
#chat-input-container .flex {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Tailwind space-x-4 */
}
#chat-input {
    flex: 1;
    border: 2px solid #808080; /* Dark gray */
    border-radius: 2px; /* Slightly rounded for Windows 95 look */
    padding: 0.5rem 1rem; /* Tailwind px-4 py-2 */
    outline: none;
    width: 75%; /* Tailwind w-3/4 */
    background-color: #FFFFFF; /* White */
    box-shadow: inset 2px 2px 5px #FFFFFF, inset -2px -2px 5px #808080; /* Inset beveled effect */
    font-family: 'MS Sans Serif', 'Arial', sans-serif; /* Windows 95 font */
}
#chat-input:focus {
    border-color: #000080; /* Navy blue */
}
#chat-submit {
    background-color: #C3C3C3; /* Light gray */
    color: #000; /* Black */
    border: 2px solid #808080; /* Dark gray */
    border-radius: 2px; /* Slightly rounded for Windows 95 look */
    padding: 0.5rem 1rem; /* Tailwind px-4 py-2 */
    cursor: pointer;
    box-shadow: 2px 2px 5px #FFFFFF, -2px -2px 5px #808080; /* Beveled effect */
    transition: background-color 0.3s;
    font-family: 'MS Sans Serif', 'Arial', sans-serif; /* Windows 95 font */
}
#chat-submit:hover {
    background-color: #808080; /* Dark gray */
}
#chat-input-container .text-center {
    text-align: center;
    font-size: 0.75rem; 
    padding-top: 0.5rem;
    font-family: 'MS Sans Serif', 'Arial', sans-serif; /* Windows 95 font */
}
.message-container {
    display: flex;
    margin-bottom: 0.75rem;
}
.message-container.user {
    justify-content: flex-end;
}
.message-container.reply {
    justify-content: flex-start;
}
.message {
    background-color: #C3C3C3; /* WIndows Light gray */
    color: #000; /* Black */
    border-radius: 2px; /* Slightly rounded for Windows 95 look */
    padding: 0.5rem 1rem; /* Tailwind py-2 px-4 */
    max-width: 70%;
    /*box-shadow: 2px 2px 5px #808080, -2px -2px 5px #FFFFFF; *//* Beveled effect */
    font-family: 'MS Sans Serif', 'Arial', sans-serif; /* Windows 95 font */
}
.message.reply {
    background-color: #FFFFFF; /* White */
    color: #000; /* Black */
   /* box-shadow: 2px 2px 5px #FFFFFF, -2px -2px 5px #808080;*/ /* Beveled effect */
   /* Base styles remain as provided */
}`;

  document.head.appendChild(style);
}
//#endregion

//#region HTMLWidget
function createHTMLWidget(chatName) {
  // Create chat widget container
  const chatWidgetContainer = document.createElement('div');
  chatWidgetContainer.id = 'chat-widget-container';
  document.body.appendChild(chatWidgetContainer);
  // Inject the HTML
  chatWidgetContainer.innerHTML = `
    <div id="chat-bubble">
     <img src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Maggie&backgroundColor=00897b,43a047,00acc1,039be5,1e88e5,3949ab,546e7a,5e35b1,6d4c41&backgroundType[]&eyes=robocop&mouth=smile01" alt="avatar" />
    </div>
    <div id="chat-popup" class="hidden" style="display: none;">
      <div id="chat-header">
        <h3>${chatName}</h3>
        <button id="close-popup">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-container">
        <div class="flex">
          <input type="text" id="chat-input" placeholder="Type your message...">
          <button id="chat-submit">Send</button>
        </div>
      </div>
    </div>
  `;

}
//#endregion