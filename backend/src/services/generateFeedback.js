import { getGroqClient } from "../utils/groqClient.js";

export const generateFeedback = async (questionTitle, userAnswer, difficulty) => {
 const groq = getGroqClient();

    const systemPrompt = `You are a strict but fair technical interviewer.
The candidate's answer may be a written explanation, pseudocode, or real code (in any language).
Award points based on difficulty: Easy questions max 30 points, Medium max 50 points, Hard max 70 points.
Points should scale with how correct, complete, and well-communicated the answer is — a mediocre answer to a Hard question might earn fewer points than an excellent answer to an Easy one.
Respond with ONLY valid JSON, no markdown, no extra text, in exactly this shape:
{
  "correctness": { "score": <0-10>, "notes": "<short note>" },
  "clarity": { "score": <0-10>, "notes": "<short note>" },
  "communication": { "score": <0-10>, "notes": "<short note>" },
  "points": <integer, based on difficulty and quality as described above>,
  "followUpQuestion": "<one relevant follow-up question>"
}`;

    const userPrompt = `Question: ${questionTitle}\nDifficulty: ${difficulty}\nCandidate's answer:\n${userAnswer}`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
};