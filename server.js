import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const answers = [
    {
        keywords: ["navn", "hedder", "hvem er du"],
        answer: "Jeg hedder Martin. Stil mere specifikke spørgsmål, hvis du gerne vil vide mere om mig :)"
    },
    {
        keywords: ["fritid", "hobby", "kan lide"],
        answer: "I min fritid kan jeg godt lide at dyrke mine hobbyer inden for bl.a. den gastronmiske verden, bruge tid sammen med mine nærmeste. Derudover træner jeg, så jeg sikrer at jeg ikke skal bekymre mig om hvad det er jeg spiser xD"
    },
    {
        keywords: ["bor", "by", "fra"],
        answer: "Jeg bor i Aalborg lige nu, men jeg kommer oprindeligt fra Sønderborg."
    },
    {
        keywords: ["alder", "hvor gammel"],
        answer: "Jeg er 27 år gammel."
    }
];

function findAnswer(question) {
    const normalizedQuestion = question.toLowerCase();

    for (const answerGroup of answers) {
        const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

        if (hasMatch) {
            return answerGroup.answer;
        }
    }

    return "Det kender jeg ikke svaret på endnu.";
}

function sanitizeQuestion(input) {
    return input.replace(/[\u0000-\u001F\u007F]/g, "");
}

const messages = [];

app.get("/", (req, res) => {
    res.render("index", { messages, error: "" });
});

app.post("/ask", (req, res) => {
    const rawQuestion = req.body.question;
    const question = sanitizeQuestion(rawQuestion).trim();
    let error = "";

    if (!question) {
        error = "Skriv et spørgsmål, før du sender."
    } else if (question.length > 280) {
        error = "Spørgsmålet må højst være 280 tegn.";
    } else {
        messages.push({ type: "question", text: question });

        const answer = findAnswer(question);
        messages.push({ type: "answer", text: answer });
    }

    res.render("index", { messages, error });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});