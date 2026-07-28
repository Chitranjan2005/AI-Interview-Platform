import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "../app.js";
import { Sheet } from "../models/sheet.model.js";
import { ApproachGroup } from "../models/approachGroup.model.js";
import { Question } from "../models/question.model.js";

dotenv.config({ path: "./.env" });

let accessToken;
let testSheetId;

beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}/QuestionDB_test`);

    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }

    // Register + login a test user to get an access token
    await request(app).post("/api/v1/users/register").send({
        username: "practiceuser",
        fullName: "Practice User",
        email: "practiceuser@test.com",
        password: "test1234",
    });

    const loginRes = await request(app).post("/api/v1/users/login").send({
        email: "practiceuser@test.com",
        password: "test1234",
    });

    accessToken = loginRes.body.data.accessToken;

    // Seed minimal data needed: 1 approach group + a few questions + 1 sheet
    const group = await ApproachGroup.create({
        name: "Test Group",
        tags: ["two pointers"],
    });

    await Question.insertMany([
        {
            title: "Sample Question 1",
            category: "DSA",
            difficulty: "Easy",
            approachTags: ["two pointers"],
            sourceUrl: "https://example.com/1",
        },
        {
            title: "Sample Question 2",
            category: "DSA",
            difficulty: "Easy",
            approachTags: ["two pointers"],
            sourceUrl: "https://example.com/2",
        },
    ]);

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

describe("Practice start route", () => {
    it("should reject request without auth token", async () => {
        const res = await request(app).get(`/api/v1/practice/start/${testSheetId}`);
        expect(res.statusCode).toBe(401);
    });

    it("should return a practice session with questions for a valid sheet", async () => {
        const res = await request(app)
            .get(`/api/v1/practice/start/${testSheetId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.sessionId).toBeDefined();
        expect(res.body.data.questions.length).toBeGreaterThan(0);
    });

    it("should return 404 for a non-existent sheet id", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/v1/practice/start/${fakeId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(404);
    });
});