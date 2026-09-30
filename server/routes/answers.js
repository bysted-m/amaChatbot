import express from "express";
import { loadAnswers, saveAnswers } from "../data/answers.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const answers = await loadAnswers();

    res.json(answers);
});

router.get("/:category", async (req, res) => {
    const answers = await loadAnswers();
    const answerRule = answers.find((a) => a.category === req.params.category);

    res.json(answerRule);
});

router.post("/", async (req, res) => {
    const answers = await loadAnswers();
    const newAnswerRule = {
        category: req.body.category,
        keywords: req.body.keywords,
        answer: req.body.answer
    };

    answers.push(newAnswerRule);
    await saveAnswers(answers);

    res.json(newAnswerRule);
});

router.put("/:category", async (req, res) => {
    const answers = await loadAnswers();
    const answerRule = answers.find((a) => a.category === req.params.category);

    answerRule.keywords = req.body.keywords;
    answerRule.answer = req.body.answer;
    await saveAnswers(answers);

    res.json(answerRule);
});

router.delete("/:category", async (req, res) => {
    const answers = await loadAnswers();
    const updatedAnswers = answers.filter((a) => a.category !== req.params.category);

    await saveAnswers(updatedAnswers);

    res.send();
});

export default router;