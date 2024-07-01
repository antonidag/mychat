(function() {
    // Inject the CSS
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
    #chat-popup {
      height: 70vh;
      max-height: 70vh;
      transition: all 0.3s;
      overflow: hidden;
      display: none; /* Ensure the chat popup is initially hidden */
    }
    @media (max-width: 768px) {
      #chat-popup {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
    }
    #chat-bubble {
      width: 4rem;
      height: 4rem;
      background-color: #2d3748; /* Tailwind gray-800 */
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.875rem; /* Tailwind text-3xl */
    }
    #chat-bubble svg {
      width: 2.5rem; /* Tailwind w-10 */
      height: 2.5rem; /* Tailwind h-10 */
      color: #fff; /* Tailwind text-white */
    }
    #chat-popup {
      position: absolute;
      bottom: 20px;
      right: 0;
      width: 24rem; /* Tailwind w-96 */
      background-color: #fff; /* Tailwind bg-white */
      border-radius: 0.375rem; /* Tailwind rounded-md */
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Tailwind shadow-md */
      display: flex;
      flex-direction: column;
      transition: all 0.3s;
      font-size: 0.875rem; /* Tailwind text-sm */
    }
    #chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem; /* Tailwind p-4 */
      background-color: #2d3748; /* Tailwind bg-gray-800 */
      color: #fff; /* Tailwind text-white */
      border-top-left-radius: 0.375rem; /* Tailwind rounded-t-md */
      border-top-right-radius: 0.375rem; /* Tailwind rounded-t-md */
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
      padding: 1rem; /* Tailwind p-4 */
      overflow-y: auto;
    }
    #chat-input-container {
      padding: 1rem; /* Tailwind p-4 */
      border-top: 1px solid #e5e7eb; /* Tailwind border-gray-200 */
    }
    #chat-input-container .flex {
      display: flex;
      align-items: center;
      gap: 1rem; /* Tailwind space-x-4 */
    }
    #chat-input {
      flex: 1;
      border: 1px solid #d1d5db; /* Tailwind border-gray-300 */
      border-radius: 0.375rem; /* Tailwind rounded-md */
      padding: 0.5rem 1rem; /* Tailwind px-4 py-2 */
      outline: none;
      width: 75%; /* Tailwind w-3/4 */
    }
    #chat-submit {
      background-color: #2d3748; /* Tailwind bg-gray-800 */
      color: #fff; /* Tailwind text-white */
      border-radius: 0.375rem; /* Tailwind rounded-md */
      padding: 0.5rem 1rem; /* Tailwind px-4 py-2 */
      cursor: pointer;
    }
    #chat-input-container .text-center {
      text-align: center;
      font-size: 0.75rem; /* Tailwind text-xs */
      padding-top: 1rem; /* Tailwind pt-4 */
    }
    .message-container {
      display: flex;
      margin-bottom: 0.75rem; /* Tailwind mb-3 */
    }
    .message-container.user {
      justify-content: flex-end;
    }
    .message-container.reply {
      justify-content: flex-start;
    }
    .message {
      background-color: #2d3748; /* Tailwind bg-gray-800 */
      color: #fff; /* Tailwind text-white */
      border-radius: 0.375rem; /* Tailwind rounded-lg */
      padding: 0.5rem 1rem; /* Tailwind py-2 px-4 */
      max-width: 70%;
    }
    .message.reply {
      background-color: #e5e7eb; /* Tailwind bg-gray-200 */
      color: #000; /* Tailwind text-black */
    }
    `;
  
    document.head.appendChild(style);
  
    // Create chat widget container
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.id = 'chat-widget-container';
    document.body.appendChild(chatWidgetContainer);
    
    // Inject the HTML
    chatWidgetContainer.innerHTML = `
      <div id="chat-bubble">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <div id="chat-popup" class="hidden">
        <div id="chat-header">
          <h3>Chat Widget by GPT4</h3>
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
          <div class="text-center">
            <span>Prompted by <a href="https://twitter.com/anantrp" target="_blank">@anantrp</a></span>
          </div>
        </div>
      </div>
    `;
  
    // Add event listeners
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatMessages = document.getElementById('chat-messages');
    const chatBubble = document.getElementById('chat-bubble');
    const chatPopup = document.getElementById('chat-popup');
    const closePopup = document.getElementById('close-popup');
  
    chatSubmit.addEventListener('click', function() {
      const message = chatInput.value.trim();
      if (!message) return;
  
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.value = '';
      onUserRequest(message);
    });
  
    chatInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        chatSubmit.click();
      }
    });
  
    chatBubble.addEventListener('click', function() {
      togglePopup();
    });
  
    closePopup.addEventListener('click', function() {
      togglePopup();
    });
  
    function togglePopup() {
      chatPopup.classList.toggle('hidden');
      if (!chatPopup.classList.contains('hidden')) {
        chatPopup.style.display = 'flex'; // Ensure the popup is shown
        chatInput.focus();
      } else {
        chatPopup.style.display = 'none'; // Ensure the popup is hidden
      }
    }
  
    function onUserRequest(message) {
      console.log('User request:', message);
  
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
  
      setTimeout(function() {
        reply('Hello! This is a sample reply.');
      }, 1000);
    }
  
    function reply(message) {
      const replyElement = document.createElement('div');
      replyElement.className = 'message-container reply';
      replyElement.innerHTML = `
        <div class="message reply">
          ${message}
        </div>
      `;
      chatMessages.appendChild(replyElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  })();
  