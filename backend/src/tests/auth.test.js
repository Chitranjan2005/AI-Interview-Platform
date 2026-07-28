import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "../app.js";

dotenv.config({ path: "./.env" });

beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}/QuestionDB_test`);
});

beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}/QuestionDB_test`);

    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
    await mongoose.connection.close();
});

describe("Auth routes", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/v1/users/register")
            .send({
                username: "testuser1",
                fullName: "Test User",
                email: "testuser1@test.com",
                password: "test1234",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.username).toBe("testuser1");
    });

    it("should not allow duplicate email registration", async () => {
        const res = await request(app)
            .post("/api/v1/users/register")
            .send({
                username: "testuser2",
                fullName: "Test User 2",
                email: "testuser1@test.com",
                password: "test1234",
            });

        expect(res.statusCode).toBe(409);
    });

    it("should login with correct credentials", async () => {
        const res = await request(app)
            .post("/api/v1/users/login")
            .send({
                email: "testuser1@test.com",
                password: "test1234",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.accessToken).toBeDefined();
    });

    it("should reject login with wrong password", async () => {
        const res = await request(app)
            .post("/api/v1/users/login")
            .send({
                email: "testuser1@test.com",
                password: "wrongpassword",
            });

        expect(res.statusCode).toBe(401);
    });
});