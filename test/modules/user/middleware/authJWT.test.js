import {
  verifyToken,
  verifyRole,
  generateAccessToken,
  generateRefreshToken,
} from "@userMiddleware/authMiddleware.js";
import jwt from "jsonwebtoken";

describe("authenticate middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  /**
   * Verify Role Middleware - Role Mismatch
   *
   * Ensures that the `verifyRole` middleware correctly denies access
   * when the user's role does not match the required role. Specifically, it
   * simulates a user with the "editor" role attempting to access a route that
   * requires the "admin" role and verifies the appropriate response.
   */
  it("should return 403 if the user's role does not match the required role", () => {
    const middleware = verifyRole("admin"); // Middleware expecting an "admin" role

    // Mock a user with the "editor" role attached to the request object
    req.user = { id: 1, username: "testuser", role: "editor" };

    middleware(req, res, next); // Call the middleware with mocked request/response/next

    // Assertions
    expect(res.status).toHaveBeenCalledWith(403); // Verify 403 Forbidden status
    expect(res.json).toHaveBeenCalledWith({
      message: "Access forbidden: insufficient permissions", // Check error message
    });
    expect(next).not.toHaveBeenCalled(); // Ensure next() is not invoked
  });

  /**
   * Verify Role Middleware - Role Matches
   *
   * Ensures that the `verifyRole` middleware allows access when the
   * user's role matches the required role. Specifically, it simulates a user
   * with the "admin" role accessing a route that requires the "admin" role
   * and verifies that next() is called without returning an error.
   */
  it("should call next() if the user's role matches the required role", () => {
    const middleware = verifyRole("admin"); // Middleware expecting an "admin" role

    // Mock a user with the "admin" role attached to the request object
    req.user = { id: 1, username: "testuser", role: "admin" };

    middleware(req, res, next); // Call the middleware with mocked request/response/next

    // Assertions
    expect(next).toHaveBeenCalled(); // Verify next() is called
    expect(res.status).not.toHaveBeenCalled(); // Ensure no error response is sent
    expect(res.json).not.toHaveBeenCalled(); // Ensure no error message is returned
  });

  /**
   * Access Token Structure
   *
   * Ensures that the `generateAccessToken` function generates a JWT
   * with the correct payload structure. Specifically, it validates that the
   * token includes the user's `id`, `username`, and `role` fields.
   */
  it("should generate a JWT with the correct payload structure", () => {
    const user = { id: 1, username: "testuser", role: "admin" };

    const token = generateAccessToken(user);

    const decoded = jwt.decode(token);

    // Assertions
    expect(decoded).toMatchObject({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  });

  /**
   * Refresh Token Structure
   *
   * Ensures that the `generateRefreshToken` function generates a JWT
   * with the correct payload structure and includes the correct expiration time.
   */
  it("should generate a refresh token with the correct payload and expiration", () => {
    // Mock user data
    const user = { id: 1, username: "testuser", role: "admin" };

    // Generate the refresh token
    const token = generateRefreshToken(user);

    // Decode the token
    const decoded = jwt.decode(token);

    // Assertions
    expect(decoded).toMatchObject({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Ensure the token includes an expiration time
    const expirationTime = token.split(".")[1]; // Token payload is the second part
    expect(expirationTime).toBeDefined();
  });

  /**
   * Invalid Payload for Token Generation
   *
   * Ensures that the token generation functions throw an appropriate error
   * when provided with an incomplete or malformed user object.
   */
  it("should throw an error for invalid payload in token generation", () => {
    // Malformed user object
    const invalidUser = { username: "testuser" }; // Missing 'id' and 'role'

    // Expect generateAccessToken to throw an error
    expect(() => generateAccessToken(invalidUser)).toThrow(
      "Invalid user object. Expected an object with 'id', 'username', and 'role' properties.",
    );

    // Expect generateRefreshToken to throw an error
    expect(() => generateRefreshToken(invalidUser)).toThrow(
      "Invalid user object. Expected an object with 'id', 'username', and 'role' properties.",
    );
  });
});
