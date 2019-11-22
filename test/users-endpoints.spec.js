const knex = require("knex");
const bcrypt = require("bcryptjs");
const helpers = require("../test/test-helper");
const app = require("../src/app");

describe("Users Endpoints", function() {
  let db;

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

  describe("A Sample test function", () => {
    it(`should divide positive integers correctly`, () => {
      //define inputs
      const a = 8;
      const b = 4;
      const expectedAnswer = 2;

      //invoke the function
      const actualAnswer = helpers.divide(a, b);

      //assert that expected === actual
      expect(actualAnswer).to.equal(expectedAnswer);
    });

    it("throws an error", () => {
      const a = 8;
      const b = 0;

      const fnCall = () => helpers.divide(a, b);

      expect(fnCall).to.throw();
    });
  });
  describe("testing GET '/' endpoint", () => {
    it(`should GET ("/")`, () => {
      supertest(app)
        .get("/")
        .expect(200, "Hello World!");
    });
  });

  describe("testing .get '/api/users' endpoint", () => {
    it(`should GET ("/api/users")`, () => {
      supertest(app)
        .get("/api/users")
        .expect(200, helpers.users);
    });
  });
});
