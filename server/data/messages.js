import fs from "node:fs/promises"

export async function loadMessages() {
    const data = await fs.readFile("./data/messages.json", "utf-8");
    return JSON.parse(data);
}

export async function saveMessages(messages) {
    const json = JSON.stringify(messages, null, 2);
    await fs.writeFile("./data/messages.json", json);
}