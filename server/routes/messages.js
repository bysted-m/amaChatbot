import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { loadAnswers } from "../data/answers.js";
import { findAllAnswers } from "../utils/answerLogic.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const messages = await loadMessages();

    res.json(messages);
});

router.post("/", async (req, res) => {
    const messages = await loadMessages();
    const answers = await loadAnswers();
    const question = req.body.question.trim();

    if (!question) {
        res.json({ error: "Skriv et spørgsmål, før du sender." });
        return;
    }

    const message = { type: "question", text: question, createdAt: new Date().toISOString() };
    messages.push(message);

    const answerList = findAllAnswers(question, answers);
    const answerMessage = {
        type: "answer",
        text: answerList.map((a) => a.text).join(" "),
        createdAt: new Date().toISOString()
    };
    messages.push(answerMessage);

    await saveMessages(messages);

    res.json({ question: message, answer: answerMessage });
});

router.delete("/", async (req, res) => {
    await saveMessages([]);

    res.send();
});

export default router;