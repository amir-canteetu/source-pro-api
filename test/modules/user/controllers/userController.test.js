import request from "supertest";
import express from "express";
import * as userController from "@userControllers/userController.js";
import User from "@userModels/userModel.js";
import errorHandler from "@middleware/errorHandler.js";

jest.mock("@userModels/userModel.js"); // Mock the User model

const app = express();
app.use(express.json());

// Dummy routes for testing
app.get("/users", userController.getAllUsers);
app.get("/users/:userId", userController.getUserById);
app.post("/users", userController.createUser);
app.put("/users/:userId", userController.updateUser);
app.delete("/users/:userId", userController.deleteUser);

app.use(errorHandler);

describe("User Controller Tests", () => {
  // Mock Users Data
  const mockUsers = [
    {
      user_id: 1,
      first_name: "John",
      last_name: "Doe",
      username: "superadmin",
      email: "example.name@gmail.com",
      role_id: 1,
      organization_id: null,
    },
    {
      user_id: 2,
      first_name: "Alice",
      last_name: "Smith",
      username: "alicesmith",
      email: "buyer@example.com",
      role_id: 2,
      organization_id: 2,
    },
    {
      user_id: 3,
      first_name: "Bob",
      last_name: "Johnson",
      username: "benjohnson",
      email: "supplier@example.com",
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
    User.getUserById.mockResolvedValue(mockUsers[0]);
    const userId = mockUsers[0].user_id;
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers[0]);
    expect(User.getUserById).toHaveBeenCalledWith(`${userId}`);
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

    expect(User.createUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toBe("Invalid email format");
  });

  it("should return a validation error if name is missing", async () => {
    const response = await request(app).post("/users").send({
      email: "valid@example.com",
      password: "securePassword",
    });

    expect(User.createUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe("Name is required");
  });

  it("should return a validation error if password is missing", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "valid@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe("Password is required");
  });

  it("should handle server errors when creating a user", async () => {
    User.createUser.mockRejectedValue(new Error("Database Error"));
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "securePassword",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database Error");
  });

  it("should return an empty array if no users exist", async () => {
    User.getAllUsers.mockResolvedValue([]);
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  /** Test: Update User */
  it("should update a user successfully", async () => {
    User.updateUser.mockResolvedValue(1); // Assume 1 row affected
    const userId = mockUsers[0].user_id;
    const response = await request(app)
      .put(`/users/${userId}`)
      .send({ name: "Updated Name", email: "updated@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User updated successfully",
      rowsAffected: 1,
    });
    expect(User.updateUser).toHaveBeenCalledWith(
      `${userId}`,
      expect.any(Object),
    );
  });

  /** Test: Delete User */
  it("should delete a user successfully", async () => {
    User.deleteUser.mockResolvedValue(1); // Assume 1 row deleted
    const userId = mockUsers[0].user_id;
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User deleted successfully",
      rowsAffected: 1,
    });
    expect(User.deleteUser).toHaveBeenCalledWith(`${userId}`);
  });

  /** Test: Error Handling */
  it("should handle server errors gracefully", async () => {
    User.getAllUsers.mockRejectedValue(new Error("Database Error"));

    const response = await request(app).get("/users");
    expect(User.getAllUsers).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database Error");
  });

  it("should handle server errors when updating a user", async () => {
    User.updateUser.mockRejectedValue(new Error("Database Error"));
    const userId = mockUsers[0].user_id;
    const response = await request(app).put(`/users/${userId}`).send({
      name: "Updated Name",
      email: "updated@example.com",
    });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database Error");
  });

  it("should return 404 if user does not exist", async () => {
    User.getUserById.mockResolvedValue(null);
    const response = await request(app).get("/users/999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
