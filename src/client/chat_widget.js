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


    const guidID = generateUUID()

    const body = await promptAI(message);
    reply(body.response, guidID)

    /*
    let currentResponse = "";
    const stream = await promptAI(message);
      for chunk in stream
        currentResponse += body.response;
        reply(body.response, guidID)
    */
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
@font-face {
    font-family: 'Windows 95';
    src: url('https://antonidag.github.io/static-files/fonts/ms/w-95-sans-serif.woff2') format('woff2'),
        url('https://antonidag.github.io/static-files/fonts/ms/w-95-sans-serif.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
#chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    z-index:999;
    font-family: "Windows 95", sans-serif;
}
#chat-bubble {
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.875rem;
    z-index: 1000;
    transition: transform 0.3s;
    border-radius: 5px;
    font-family: "Windows 95", sans-serif;
}
#chat-bubble img{
    z-index: 1000;
    border-radius: inherit;
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
    right: 0px;
    background-color: #C3C3C3;
    border-top: 2px solid #F0F0F0; /* Windows White */
    border-left: 2px solid #F0F0F0; /* Windows White */
    border-right: 2px solid #111111; /* Windows Black */
    border-bottom: 2px solid #111111; /* Windows Black */
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    font-size: 0.875rem;
    z-index: 1001;
    font-family: "Windows 95", sans-serif;
}
#chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #000080; /* Navy blue */
    color: #fff; 
    font-family: "Windows 95", sans-serif;
    padding: 0.5rem 1rem; 
}
#chat-header h3 {
    margin: 0;
    font-size: 1.125rem; 
    font-family: "Windows 95", sans-serif;
}
#close-popup {
    background-color: #C3C3C3; /* Light gray */
    color: #000; /* Black */
    border-top: 2px solid #F0F0F0; /* Windows White */
    border-left: 2px solid #F0F0F0; /* Windows White */
    border-right: 2px solid #111111; /* Windows Black */
    border-bottom: 2px solid #111111; /* Windows Black */
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: "Windows 95", sans-serif;
    padding: 0.2rem;
}
#close-popup svg {
    height: 1rem;
    width: 1rem; 
}
#chat-messages {
    flex: 1;
    overflow-y: auto;
    background-color: #008282; /* Windows Green */
    border-top: 2px solid #8F8F8F; /* Windows Black */
    border-left: 2px solid #8F8F8F; /* Windows Black */
    border-right: 2px solid #F0F0F0; /* Windows White */
    border-bottom: 2px solid #F0F0F0; /* Windows White */
    font-family: "Windows 95", sans-serif;
    padding: 0.5rem 1rem; 
}
#chat-input-container {
    border-top: 2px solid #808080; /* Dark gray */
    background-color: #C3C3C3; /* Light gray */
    font-family: "Windows 95", sans-serif;
    padding: 0.5rem 1rem; 
}
#chat-input-container .flex {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
#chat-input {
    flex: 1;
    border-top: 2px solid #8F8F8F; /* Windows Black */
    border-left: 2px solid #8F8F8F; /* Windows Black */
    border-right: 2px solid #F0F0F0; /* Windows White */
    border-bottom: 2px solid #F0F0F0; /* Windows White */
    outline: none;
    width: 75%; /* Tailwind w-3/4 */
    background-color: #FFFFFF; /* White */
    font-family: "Windows 95", sans-serif;
}
#chat-submit {
    background-color: #C3C3C3; /* Light gray */
    color: #000; /* Black */
    border-top: 2px solid #F0F0F0; /* Windows White */
    border-left: 2px solid #F0F0F0; /* Windows White */
    border-right: 2px solid #111111; /* Windows Black */
    border-bottom: 2px solid #111111; /* Windows Black */
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: "Windows 95", sans-serif;
    padding: 0.5rem 1rem; 
}
#chat-submit:focus, #chat-input:focus, #close-popup:focus {
    border-top: 2px dotted #8F8F8F; /* Windows Black */
    border-left: 2px dotted #8F8F8F; /* Windows Black */
    border-right: 2px dotted #8F8F8F; /* Windows White */
    border-bottom: 2px dotted #8F8F8F; /* Windows White */
    outline: solid;
}
#close-popup:hover,#chat-submit:hover {
    background-color: #808080; /* Dark gray */
}
#chat-input-container .text-center {
    text-align: center;
    font-size: 0.75rem; 
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
    border-top: 2px solid #F0F0F0; /* Windows White */
    border-left: 2px solid #F0F0F0; /* Windows White */
    border-right: 2px solid #111111; /* Windows Black */
    border-bottom: 2px solid #111111; /* Windows Black */
    max-width: 70%;
    padding: 0.5rem 1rem; 
}
.message.reply {
    background-color: #FFFFFF; /* White */
    color: #000; /* Black */
    padding: 0.5rem 1rem; 
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
          <span>X</span>
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