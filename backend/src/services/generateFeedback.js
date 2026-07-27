import { getGroqClient } from "../utils/groqClient.js";

export const generateFeedback = async (questionTitle, userAnswer) => {
    const groq = getGroqClient();

    const systemPrompt = `You are a strict but fair technical interviewer.
The candidate's answer may be a written explanation, pseudocode, or real code (in any language).
Evaluate it and respond with ONLY valid JSON, no markdown, no extra text, in exactly this shape:
{
  "correctness": { "score": <0-10>, "notes": "<short note>" },
  "clarity": { "score": <0-10>, "notes": "<short note>" },
  "communication": { "score": <0-10>, "notes": "<short note>" },
  "followUpQuestion": "<one relevant follow-up question>"
}`;

    const userPrompt = `Question: ${questionTitle}\nCandidate's answer:\n${userAnswer}`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0].message.content;
    return JSON.parse(rawText);
};