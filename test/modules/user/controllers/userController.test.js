import request from "supertest";
import express from "express";
import pool from "@config/dbConfig.js";
import * as userController from "@userModule/controllers/userController.js";
import User from "@userModule/models/userModel.js";
import path from "path";
import { cleanDumpFile, seedDatabase } from "../../../database/seedDatabase";

jest.mock("@userModule/models/userModel.js"); // Mock the User model

const app = express();
app.use(express.json());

// Dummy routes for testing
app.get("/users", userController.getAllUsers);
app.get("/users/:userId", userController.getUserById);
app.post("/users", userController.createUser);
app.put("/users/:userId", userController.updateUser);
app.delete("/users/:userId", userController.deleteUser);

const sqlDumpPath = path.resolve(
  process.cwd(),
  "test/database",
  "test_db_dump.sql",
);

beforeAll(async () => {
  await cleanDumpFile(sqlDumpPath);
  await seedDatabase();
});

afterAll(async () => {
  await pool.end(); // Close connection pool after tests
});

describe("User Controller Tests", () => {
  // Mock Users Data
  const mockUsers = [
    {
      user_id: 1,
      first_name: "John",
      last_name: "Doe",
      username: "superadmin",
      email: "example.name@gmail.com",
      password_hash: "savvsrvsr@#$dsfv",
      role_id: 1,
      organization_id: null,
    },
    {
      user_id: 2,
      first_name: "Alice",
      last_name: "Smith",
      username: "alicesmith",
      email: "buyer@example.com",
      password_hash: "$2b$10$Gq6ebBkrXc/N3p5HyNHsTOCx",
      role_id: 2,
      organization_id: 2,
    },
    {
      user_id: 3,
      first_name: "Bob",
      last_name: "Johnson",
      username: "benjohnson",
      email: "supplier@example.com",
      password_hash: "$2b$10$Gq6ebBkrXc/N3p5HyNHsTOC",
      role_id: 3,
      organization_id: 1,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  /** Test: Get All Users */
  it("should return all users", async () => {
    User.getAllUsers.mockResolvedValue(mockUsers);

    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(User.getAllUsers).toHaveBeenCalledTimes(1);
  });

  /** Test: Get User by ID */
  it("should return a user by ID", async () => {
    const mockUser = {
      user_id: 1,
      first_name: "John",
      last_name: "Doe",
      username: "superadmin",
      email: "example.name@gmail.com",
      password_hash: "savvsrvsr@#$dsfv",
      role_id: 1,
      organization_id: null,
    };
    User.getUserById.mockResolvedValue(mockUser);

    const response = await request(app).get("/users/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(User.getUserById).toHaveBeenCalledWith("1");
  });

  /** Test: Create User with Validation */
  it("should create a user successfully", async () => {
    User.createUser.mockResolvedValue(1); // Assume user ID is 1

    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User created successfully",
      userId: 1,
    });
    expect(User.createUser).toHaveBeenCalledTimes(1);
  });

  /** Test: Create User - Validation Error */
  it("should return a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "invalid_email",
      password: "securePassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toBe("Invalid email format");
  });

  /** Test: Update User */
  it("should update a user successfully", async () => {
    User.updateUser.mockResolvedValue(1); // Assume 1 row affected

    const response = await request(app)
      .put("/users/1")
      .send({ name: "Updated Name", email: "updated@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User updated successfully",
      rowsAffected: 1,
    });
    expect(User.updateUser).toHaveBeenCalledWith("1", expect.any(Object));
  });

  /** Test: Delete User */
  it("should delete a user successfully", async () => {
    User.deleteUser.mockResolvedValue(1); // Assume 1 row deleted

    const response = await request(app).delete("/users/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User deleted successfully",
      rowsAffected: 1,
    });
    expect(User.deleteUser).toHaveBeenCalledWith("1");
  });

  /** Test: Error Handling */
  it("should handle server errors gracefully", async () => {
    User.getAllUsers.mockRejectedValue(new Error("Database Error"));

    const response = await request(app).get("/users");
    console.log(response);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database Error");
  });
});
