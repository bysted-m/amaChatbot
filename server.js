// import express from "express";

// const app = express();
// const port = 3000;

// app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));

// function calculateAge(birthdate) {
//     const today = new Date();
//     const birthday = new Date(birthdate);

//     let age = today.getFullYear() - birthday.getFullYear();
//     const monthDiff = today.getMonth() - birthday.getMonth();

//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
//         age--;
//     }
//     return age;
// }

// const myBirthday = "1999-03-03"
// const myAge = calculateAge(myBirthday)

// function countMatches(keywords, normalizedQuestion) {
//     const matches = keywords.filter((keyword) =>
//         normalizedQuestion.includes(keyword)
//     );

//     return matches.length;
// }

// function findBestAnswer(question) {
//     const normalizedQuestion = question.toLowerCase();
//     let bestScore = 0;
//     let bestAnswer = "Det kender jeg ikke svaret på endnu.";

//     for (const answerObject of answers) {
//         const score = countMatches(answerObject.keywords, normalizedQuestion);

//         if (score > bestScore) {
//             bestScore = score;
//             bestAnswer = answerObject.answer;
//         }
//     }

//     return bestAnswer;
// }


// // function findAnswer(question) {
// //     const normalizedQuestion = question.toLowerCase();

// //     for (const answerObject of answers) {
// //         const hasMatch = answerObject.keywords.some((keyword) => normalizedQuestion.includes(keyword));

// //         if (hasMatch) {
// //             return answerObject.answer;
// //         }
// //     }

// //     return "Det kender jeg ikke svaret på endnu.";
// // }

// function sanitizeQuestion(input) {
//     return input.replace(/[\u0000-\u001F\u007F]/g, "");
// }

// const messages = [];

// app.get("/", (req, res) => {
//     res.render("index", { messages, error: "" });
// });

// app.post("/ask", (req, res) => {
//     const rawQuestion = req.body.question;
//     const question = sanitizeQuestion(rawQuestion).trim();
//     let error = "";

//     if (!question) {
//         error = "Skriv et spørgsmål, før du sender."
//     } else if (question.length > 280) {
//         error = "Spørgsmålet må højst være 280 tegn.";
//     } else {
//         messages.push({ type: "question", text: question });

//         const rawAnswer = findBestAnswer(question);
//         const answer = typeof rawAnswer === "function" ? rawAnswer() : rawAnswer;
//         messages.push({ type: "answer", text: answer });
//     }

//     res.render("index", { messages, error });
// });


// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });


// ---------- Opdateret med RegEx --------- //

import express, { text } from "express";
import { answers } from "./data/answers.js";
import fs from "node:fs/promises";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Escapes special characters in keywords so regex doesn't break on e.g. "?" or "."
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Splits a full question into smaller sub-clauses on "og", "," and "?",
// so that multi-part questions (e.g. "hvor bor du og hvor gammel er du")
// can be matched against the knowledge base individually
function splitQuestion(question) {
    return question
        .split(/\s+og\s+|,|\?/i)
        .map((s) => s.trim())
        .filter(Boolean);
}

// Counts how many keywords match as WHOLE words in a given text.
// Uses word boundaries (\b) so "by" doesn't match inside "hobby", etc.
function countMatches(keywords, normalizedText) {
    const matches = keywords.filter((keyword) => {
        const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
        return regex.test(normalizedText);
    });

    return matches.length;
}

// Finds the single best-matching answer for one sub-clause of a question,
// based on which knowledge base entry has the most keyword matches.
// Resolves function-based answers (like age) into their actual string value.
function findBestAnswerForPart(part) {
    const normalizedPart = normalizeQuestion(part)
    let bestScore = 0;
    let bestMatch = null;

    for (const answerObject of answers) {
        const score = countMatches(answerObject.keywords, normalizedPart);

        if (score > bestScore) {
            bestScore = score;
            bestMatch = answerObject;
        }
    }

    if (!bestMatch) return null;

    return {
        category: bestMatch.category,
        text: typeof bestMatch.answer === "function" ? bestMatch.answer() : bestMatch.answer
    };
}

// Splits the full question into sub-clauses, finds the best answer for each
// one, and collects them into a list — skipping duplicate answers in case
// multiple sub-clauses match the same knowledge base entry
function findAllAnswers(question) {
    const parts = splitQuestion(question);
    const foundAnswers = [];

    for (const part of parts) {
        const match = findBestAnswerForPart(part);

        if (match && !foundAnswers.some((answer) => answer.text === match.text)) {
            foundAnswers.push(match);
        }
    }

    if (foundAnswers.length === 0) {
        return [{ category: null, text: "Det kender jeg ikke svaret på endnu." }];
    }

    return foundAnswers;
}

function sanitizeQuestion(input) {
    return input.replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function normalizeQuestion(question) {
    return question.toLowerCase().trim().replace(/\s+/g, " ");
}

async function loadMessages() {
    const data = await fs.readFile("./data/messages.json", "utf-8");
    return JSON.parse(data);
}

async function saveMessages(messages) {
    const json = JSON.stringify(messages, null, 2);
    await fs.writeFile("./data/messages.json", json);
}

async function loadTopicStats() {
    const data = await fs.readFile("./data/topicStats.json", "utf8");
    return JSON.parse(data);
}

async function saveTopicStats(topicStats) {
    const json = JSON.stringify(topicStats, null, 2);
    await fs.writeFile("./data/topicStats.json", json);
}

app.get("/", async (req, res) => {
    const messages = await loadMessages();
    const topicStats = await loadTopicStats();

    res.render("index", { messages, error: "", topicStats });
});

app.post("/ask", async (req, res) => {
    const messages = await loadMessages();
    const topicStats = await loadTopicStats();

    const rawQuestion = req.body.question;
    const question = sanitizeQuestion(rawQuestion).trim();
    let error = "";

    if (!question) {
        error = "Skriv et spørgsmål, før du sender.";
    } else if (question.length > 280) {
        error = "Spørgsmålet må højst være 280 tegn.";
    } else {
        messages.push({ type: "question", text: question });

        const answerList = findAllAnswers(question);

        for (const match of answerList) {
            if (match.category) {
                topicStats[match.category] = (topicStats[match.category] ?? 0) + 1;
            }
        }
        messages.push({ type: "answer", text: answerList.map((answer) => answer.text).join(" ") });

        //------ Svar logik med separerede svar ------//

        // const answerList = findAllAnswers(question);
        // for (const answer of answerList) {
        //     messages.push({ type: "answer", text: answer });
        // }
    }

    await saveMessages(messages);
    await saveTopicStats(topicStats)

    res.render("index", { messages, error: "", topicStats });
});

app.post("/clear-stats", async (req, res) => {
    const topicStats = await loadTopicStats();

    for (const category of Object.keys(topicStats)) {
        topicStats[category] = 0;
    }

    await saveTopicStats(topicStats);
    res.redirect("/");
});

app.post("/clear-messages", async (req, res) => {
    await saveMessages([]);
    res.redirect("/");
});

app.post("/clear-all", async (req, res) => {
    await saveMessages([]);

    const topicStats = await loadTopicStats();
    for (const category of Object.keys(topicStats)) {
        topicStats[category] = 0;
    }
    await saveTopicStats(topicStats);

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});