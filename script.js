let chatOpen = false;
let hasNewMessage = false;

function toggleChat() {
  const container = document.getElementById('chatContainer');
  const btn = document.getElementById('chatToggleBtn');
  chatOpen = !chatOpen;

  if (chatOpen) {
    container.classList.add('open');
    btn.style.display = 'none';
    if (hasNewMessage) {
      document.getElementById('notification').style.display = 'none';
      hasNewMessage = false;
    }
  } else {
    container.classList.remove('open');
    btn.style.display = 'flex';
  }
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();

  if (message) {
    addMessage(message, 'client');
    input.value = '';
    sendToTelegram(message);

    setTimeout(() => {
      const response = getSupportResponse(message);
      addMessage(response, 'support', true);
    }, 1000);
  }
}

function addMessage(text, sender, isNotification = false) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  messageElement.textContent = text;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  if (sender === 'support' && isNotification && !chatOpen) {
    document.getElementById('notification').style.display = 'flex';
    hasNewMessage = true;
  }
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function sendToTelegram(message) {
  const botToken = '';
  const chatId = '';

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent('Новое сообщение от посетителя: ' + message)}`)
    .then(response => response.json())
    .then(data => console.log('Сообщение отправлено в Telegram'))
    .catch(error => console.error('Ошибка:', error));
}

function getSupportResponse(clientMessage) {
  const lower = clientMessage.toLowerCase();
  if (lower.includes('привет') || lower.includes('здравствуйте')) return 'Здравствуйте! Чем могу помочь?';
  if (lower.includes('карт') || lower.includes('кредит')) return 'По вопросам карт и кредитов звоните 8 (800) 250-05-20';
  if (lower.includes('приложение') || lower.includes('глюк')) return 'Попробуйте обновить приложение. Если не поможет — уточните устройство и время ошибки.';
  if (lower.includes('вклад') || lower.includes('депозит')) return 'Актуальные ставки по вкладам доступны на mtsbank.ru';
  return 'Спасибо за ваше сообщение! Наш специалист свяжется с вами в ближайшее время.';
}