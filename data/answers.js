import { calculateAge } from "../utils/age.js"
import { myBirthday } from "../utils/age.js"

export const answers = [
    {
        keywords: ["hej", "mojn", "yo", "goddag", "goddav", "hey", "vær hilset"],
        category: "Hilsen",
        answer: "Hello there :)."
    },
    {
        keywords: ["navn", "hedder", "hvad er dit navn"],
        category: "Navn",
        answer: "Jeg hedder Martin."
    },
    {
        keywords: ["hvem er du", "hvad kan du", "formål"],
        category: "Formål",
        answer: "Jeg er en chatbot hvor du kan spille spørgsmål om Martin, og så vil jeg svare så godt som Martin nu har tilladt mig det."
    },
    {
        keywords: ["fritid", "hobby", "kan lide", "hobbyer"],
        category: "Hobbyer",
        answer: "Når jeg ikke går i skole eller er på arbejde, kan jeg i min fritid godt lide at dyrke mine hobbyer inden for bl.a. den gastronmiske verden, bruge tid sammen med mine nærmeste. Derudover træner jeg, så jeg sikrer at jeg ikke skal bekymre mig om hvad det er jeg spiser xD"
    },
    {
        keywords: ["arbejde", "job", "studiejob"],
        category: "Job",
        answer: "Jeg arbejder i øjeblikket som tjener og bartender på restaurant Struktur i Aalborg, men jeg søger et studierelevant job"
    },
    {
        keywords: ["uddannelse", "læser"],
        category: "Uddannelse",
        answer: "Jeg læser en proffesionsbachelor i Webudvikling som top up på min uddannelse som Multimediedesigner."
    },
    {
        keywords: ["bor", "by", "fra"],
        category: "Bosted",
        answer: "Jeg bor i Aalborg, men jeg kommer oprindeligt fra Sønderborg."
    },
    {
        keywords: ["alder", "hvor gammel", "gammel", "fødselsdag"],
        category: "Alder",
        answer: () => `Jeg er ${calculateAge(myBirthday)} år gammel.`
    }
];