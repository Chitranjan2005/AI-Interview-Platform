import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { getGroqClient } from "../utils/groqClient.js";

const generateStatement = async (question) => {
    const groq = getGroqClient();

    const systemPrompt = `You write original DSA problem statements for a practice platform.
Respond with ONLY valid JSON, no markdown, no extra text, in exactly this shape:
{
  "statement": "2-3 sentence original problem description",
  "inputFormat": "description of input format",
  "outputFormat": "description of expected output",
  "constraints": "e.g. 1 <= n <= 10^5",
  "examples": [{ "input": "...", "output": "...", "explanation": "..." }]
}
The "input" and "output" fields inside each example MUST be plain strings (e.g. "5 3\\n1 2\\n2 3"), never nested JSON objects or arrays.
Do not mention Codeforces, LeetCode, or any external source. Write fully original wording.`;

    const userPrompt = `Problem title: "${question.title}"
Approach tags: ${question.approachTags.join(", ")}
Difficulty: ${question.difficulty}`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    // Defensive normalization — force examples' input/output to always be strings,
    // in case the model returns nested objects/arrays despite instructions
    if (Array.isArray(parsed.examples)) {
    parsed.examples = parsed.examples.map((ex) => ({
        input: typeof ex.input === "string" ? ex.input : JSON.stringify(ex.input, null, 2),
        output: typeof ex.output === "string" ? ex.output : JSON.stringify(ex.output, null, 2),
        explanation: typeof ex.explanation === "string" ? ex.explanation : "",
    }));
} else {
    parsed.examples = [];
}

    return parsed;
};

const enrichQuestions = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/QuestionDB`);
        console.log(`Mongoose connected to ${connectionInstance.connection.host}`);

        const questions = await Question.find({
            $or: [
                { generatedStatement: { $exists: false } },
                { "generatedStatement.statement": { $exists: false } },
                { "generatedStatement.statement": "" },
            ],
        });
        console.log(`Found ${questions.length} questions needing enrichment`);

        let successCount = 0;
        let failCount = 0;

        for (const question of questions) {
            try {
                const generated = await generateStatement(question);
                question.generatedStatement = generated;
                await question.save();
                successCount++;
                console.log(`Enriched: ${question.title}`);
            } catch (err) {
                failCount++;
                console.error(`Failed for "${question.title}": ${err.message}`);
            }

            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        console.log(`Done. Success: ${successCount}, Failed: ${failCount}`);
        process.exit(0);
    } catch (error) {
        console.error("Enrichment failed: ", error);
        process.exit(1);
    }
};

enrichQuestions();