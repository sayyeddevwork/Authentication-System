import request from "supertest";
import app from "./app.js";

describe("GET /", () => {
  afterAll(async () => {
    // This is where you will eventually put: await mongoose.connection.close();
  });
  it("should return 200 OK and welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});
