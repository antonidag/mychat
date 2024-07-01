window.addEventListener('load', function () {
  alert("It's loaded!")
  attachEventListeners();
  function attachEventListeners() {
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

      setTimeout(function () {
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
  }
})
