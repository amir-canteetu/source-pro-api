import { verifyToken } from "../../../../modules/user/middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken"); // Mock the jwt library

describe("authenticate middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} }; // Mocked request object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }; // Mocked response object
    next = jest.fn(); // Mocked next function
  });

  it("should return 401 if the token is missing", () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Access token missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if the token is invalid", () => {
    req.headers["authorization"] = "Bearer invalidToken";
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(new Error("Invalid token")),
    );

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach the user to req if the token is valid", () => {
    req.headers["authorization"] = "Bearer validToken";
    const mockUser = { id: 1, name: "John Doe" };
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, mockUser),
    );

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(res.status).not.toHaveBeenCalled(); // Ensure no response is sent
  });
});
