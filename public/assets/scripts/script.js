const textarea = document.getElementById("question");

textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        textarea.form.submit();
    }
});

const chatArea = document.querySelector(".msgInfo");
if (chatArea) {
    chatArea.scrollTop = chatArea.scrollHeight;
}