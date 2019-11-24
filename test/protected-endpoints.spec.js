const knex = require("knex");
//const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
const helpers = require("../test/test-helper");
const app = require("../src/app");

describe("Paycheck Protected Endpoints", function() {
  let db;

  const { testUsers, testPaychecks } = helpers.makePaycheckFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  //test table prep & clean-up.
  after("disconnect from db", () => db.destroy());
  before("cleanup", () => helpers.cleanTables(db));
  afterEach("cleanup", () => helpers.cleanTables(db));
  beforeEach("insert users & paychecks", () =>
    helpers.seedTestTables(db, testUsers, testPaychecks)
  );

  const protectedEndpoint = [
    //{
    // name: "GET /api/paystubs/:paystub_id",
    // path: "/api/paystubs/1",
    // method: supertest(app).get
    //},
    {
      name: "POST /api/paystubs",
      path: "/api/paystubs",
      method: supertest(app).post
    }
    //{
    //name: "GET /api/users/:user_id",
    // path: "/api/users/1",
    //method: supertest(app).get
    //}
  ];

  protectedEndpoint.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: `Missing bearer token` });
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = "bad-secret";
        return endpoint
          .method(endpoint.path)
          .set(
            "Authorization",
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: "Unauthorized request" });
      });
      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        //const userInvalidCreds = {user_name: "user-not",password: "existy"};
        const invalidUser = { user_email: "user-not-existy", id: 1 };
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: "Unauthorized request" });
      });
    });
  });
});
