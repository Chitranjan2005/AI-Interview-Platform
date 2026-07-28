import { jest } from "@jest/globals";

jest.unstable_mockModule("../services/generateFeedback.js", () => ({
    generateFeedback: jest.fn().mockResolvedValue({
        correctness: { score: 8, notes: "Good approach" },
        clarity: { score: 9, notes: "Clear explanation" },
        communication: { score: 7, notes: "Could explain more" },
        followUpQuestion: "What is the time complexity?",
    }),
}));

// Dynamic imports AFTER the mock registration — required with unstable_mockModule in ESM
const request = (await import("supertest")).default;
const mongoose = (await import("mongoose")).default;
const dotenv = (await import("dotenv")).default;
const { app } = await import("../app.js");
const { Sheet } = await import("../models/sheet.model.js");
const { ApproachGroup } = await import("../models/approachGroup.model.js");
const { Question } = await import("../models/question.model.js");
const { PracticeSession } = await import("../models/practiceSession.model.js");

dotenv.config({ path: "./.env" });

let accessToken;
let testSheetId;
let testQuestionId;
let testSessionId;

beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}/QuestionDB_test`);

    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }

    await request(app).post("/api/v1/users/register").send({
        username: "interviewuser",
        fullName: "Interview User",
        email: "interviewuser@test.com",
        password: "test1234",
    });

    const loginRes = await request(app).post("/api/v1/users/login").send({
        email: "interviewuser@test.com",
        password: "test1234",
    });

    accessToken = loginRes.body.data.accessToken;

    await ApproachGroup.create({
        name: "Test Group",
        tags: ["two pointers"],
    });

    const question = await Question.create({
        title: "Sample Question",
        category: "DSA",
        difficulty: "Easy",
        approachTags: ["two pointers"],
        sourceUrl: "https://example.com/1",
    });
    testQuestionId = question._id.toString();

    const sheet = await Sheet.create({
        name: "Test Sheet Easy",
        category: "DSA",
        difficulty: "Easy",
        slotCount: 1,
    });
    testSheetId = sheet._id.toString();
});

afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
    await mongoose.connection.close();
});

describe("Interview submit-answer flow", () => {
    it("should start a practice session first", async () => {
        const res = await request(app)
            .get(`/api/v1/practice/start/${testSheetId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        testSessionId = res.body.data.sessionId;
    });

    it("should reject submit-answer without auth", async () => {
        const res = await request(app).post("/api/v1/interview/submit-answer").send({
            sessionId: testSessionId,
            questionId: testQuestionId,
            answer: "some answer",
        });
        expect(res.statusCode).toBe(401);
    });

    it("should submit an answer and return mocked feedback", async () => {
        const res = await request(app)
            .post("/api/v1/interview/submit-answer")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                sessionId: testSessionId,
                questionId: testQuestionId,
                answer: "I would use two pointers, one at each end, moving inward.",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.feedback.correctness.score).toBe(8);
        expect(res.body.data.feedback.followUpQuestion).toBe("What is the time complexity?");
    });

    it("should reject submit-answer with missing fields", async () => {
        const res = await request(app)
            .post("/api/v1/interview/submit-answer")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ sessionId: testSessionId }); // missing questionId and answer

        expect(res.statusCode).toBe(400);
    });

    it("should reflect the saved entry in history", async () => {
        const res = await request(app)
            .get("/api/v1/sessions/history")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        const session = res.body.data.find((s) => s._id === testSessionId);
        expect(session).toBeDefined();
        expect(session.entries.length).toBe(1);
    });
});