const API_URL = "http://localhost:3000";

const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#amaForm");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const questionCount = document.querySelector("#question-count");

questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        questionForm.requestSubmit();
    }
});

function hideEmptyState() {
    const emptyState = document.querySelector("#empty-state");
    if (emptyState) {
        emptyState.remove();
    }
}

function displayMessage(message) {
    hideEmptyState();

    const html = /*html*/ `
        <article class="${message.type}">
            <p>${message.text}</p>
        </article>`;

    messagesContainer.insertAdjacentHTML("beforeend", html);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateQuestionCount(messages) {
    const count = messages.filter((m) => m.type === "question").length;
    questionCount.textContent = count;
}

async function getMessages() {
    const response = await fetch(`${API_URL}/messages`);
    const messages = await response.json();

    for (const message of messages) {
        displayMessage(message);
    }

    updateQuestionCount(messages);
}

questionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();
    if (!question) return;

    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    const data = await response.json();

    displayMessage(data.question);
    displayMessage(data.answer);

    const currentCount = Number(questionCount.textContent);
    questionCount.textContent = currentCount + 1;

    questionInput.value = "";
    questionInput.focus();
    // messagesContainer.innerHTML = "";
});

clearMessagesButton.addEventListener("click", async () => {
    await fetch(`${API_URL}/messages`, { method: "DELETE" });
    messagesContainer.innerHTML = /*html*/ `
        <div class="emptyState" id="empty-state">
            <div class="msg-icon">
                <img src="./assets/images/messageIcon.svg" alt="Message icon">
            </div>
            <p class="dimTxt">No questions yet.</p>
            <p class="dimTxt">Type something below.</p>
        </div>`;
    questionCount.textContent = "0";
});

getMessages();