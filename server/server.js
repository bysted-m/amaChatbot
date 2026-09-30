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

import express from "express";
import cors from "cors"
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});