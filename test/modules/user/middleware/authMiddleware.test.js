import { verifyToken, verifyRole } from "@userMiddleware/authMiddleware.js";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-token"),
  decode: jest.fn(() => ({ id: 1, username: "testuser", role: "admin" })),
  verify: jest.fn(),
}));

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {});

  it("should return 401 if the token is missing", () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Access token missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if the token is invalid", () => {
    req.headers["authorization"] = "Bearer invalidToken";

    // Mock jwt.verify to call the callback with an error
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("Invalid token"));
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired access token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach the user to req if the token is valid", () => {
    req.headers["authorization"] = "Bearer validToken";
    const mockUser = { id: 1, name: "John Doe" };
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, mockUser);
    });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 403 if the token is expired", () => {
    req.headers["authorization"] = "Bearer expiredToken";

    // Simulate a TokenExpiredError from jwt.verify
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";
      callback(error);
    });

    verifyToken(req, res, next);

    // Assertions for response
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired access token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach the user to req if the token is valid", () => {
    req.headers["authorization"] = "Bearer validToken";
    const mockUser = { id: 1, name: "John Doe" };

    // Mock jwt.verify to call the callback with no error and the mockUser
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, mockUser); // Simulate successful token verification
    });

    verifyToken(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(res.status).not.toHaveBeenCalled(); // Ensure no response is sent
  });

  it("should return 403 if req.user is not set", () => {
    const middleware = verifyRole("admin");

    req.user = null; // Simulate no user attached to the request

    middleware(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access forbidden: insufficient permissions",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
