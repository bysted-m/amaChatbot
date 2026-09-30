import fs from "node:fs/promises"

export async function loadTopicStats() {
    const data = await fs.readFile("./data/topicStats.json", "utf8");
    return JSON.parse(data);
}

export async function saveTopicStats(topicStats) {
    const json = JSON.stringify(topicStats, null, 2);
    await fs.writeFile("./data/topicStats.json", json);
}