import Groq from "groq-sdk";

let groqInstance = null;
console.log("running groqClient.js");
const getGroqClient = () => {
    if (!groqInstance) {
        groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groqInstance;
}

export { getGroqClient};
