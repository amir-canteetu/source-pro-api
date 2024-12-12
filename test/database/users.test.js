const getKnexInstance = require("../../db/knex.js");
const { testDb } = require("./db-utils.js");

describe("User Database Operations", () => {
  let db;

  beforeAll(async () => {
    db = getKnexInstance("test");
    await testDb.migrate();
    await testDb.seed();
  });

  afterEach(async () => {
    await testDb.truncate();
  });

  afterAll(async () => {
    await testDb.close();
  });

  test("should insert a user", async () => {
    const [userId] = await db("users").insert({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
    });

    const user = await db("users").where({ id: userId }).first();
    expect(user).toBeTruthy();
    expect(user.username).toBe("testuser");
  });
});
