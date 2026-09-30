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
function findBestAnswerForPart(part, answers) {
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
export function findAllAnswers(question, answers) {
    const parts = splitQuestion(question);
    const foundAnswers = [];

    for (const part of parts) {
        const match = findBestAnswerForPart(part, answers);

        if (match && !foundAnswers.some((answer) => answer.text === match.text)) {
            foundAnswers.push(match);
        }
    }

    if (foundAnswers.length === 0) {
        return [{ category: null, text: "Det kender jeg ikke svaret på endnu." }];
    }

    return foundAnswers;
}

// function sanitizeQuestion(input) {
//     return input.replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "");
// }

function normalizeQuestion(question) {
    return question.toLowerCase().trim().replace(/\s+/g, " ");
}