import request from 'supertest';
import app from '../src/app';
import { describe, it, expect } from '@jest/globals';

describe("Auth API", () => {

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "john_doe",
        password: "Password123"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Inscription réussie");
  });

  it("should login with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "john_doe",
        password: "Password123"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Connecté avec succès");
    expect(response.body).toHaveProperty("user");
  });

  it("should not login with wrong password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "john_doe",
        password: "WrongPassword"
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Identifiants invalides");
  });

});
