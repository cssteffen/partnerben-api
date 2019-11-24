const knex = require("knex");
const helpers = require("../test/test-helper");
const app = require("../src/app");

describe.only("Paycheck Endpoints", function() {
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

  describe.only(`POST /api/paystubs`, () => {
    beforeEach("insert users & paychecks", () =>
      helpers.seedTestTables(db, testUsers, testPaychecks)
    );
    const testUser = testUsers[0];
    const testPaycheck = testPaychecks[0];

    it(`creates paystub, responding with 201`, function() {
      //this.retries(3);

      const newPaycheck = {
        paystub_date: "2029-01-22T16:28:32.615Z",
        ben_hours: "495.25",
        vacation_hours: "26.75",
        sick_hours: "24.5",
        user_id: testUser.id
      };
      return supertest(app)
        .post("/api/paystubs")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(newPaycheck)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.ben_hours).to.eql(newPaycheck.ben_hours);
          expect(res.body.vacation_hours).to.eql(newPaycheck.vacation_hours);
          expect(res.body.sick_hours).to.eql(newPaycheck.sick_hours);
          //expect(res.body.user.id).to.eql(testUser.id);
          expect(res.headers.location).to.eql(`/api/paystubs/${res.body.id}`);
          const expectedDate = new Date().toLocaleString();
          const actualDate = new Date(res.body.date_created).toLocaleString();
          //expect(actualDate).to.eql(expectedDate);
        });
    });

    /* ============= NEED HELP GETTING PATCH TO WORK =================*/

    it("updates paystub, responding 204", function() {
      const upDatePaycheck = {
        id: 1,
        paystub_date: "2029-01-22T16:28:32.615Z",
        ben_hours: 415.25,
        vacation_hours: 10.15,
        sick_hours: 8.75,
        user_id: testUser.id,
        date_created: "2029-01-22T16:28:32.615Z"
      };
      console.log("TEST PAYCHECK", testPaycheck);
      console.log("TEST USER", testUser);
      return supertest(app)
        .patch("/api/paystubs/1")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(upDatePaycheck)
        .expect(204)
        .expect(res => {
          expect(res.body.ben_hours).to.eql(upDatePaycheck.ben_hours);
          expect(res.body.vacation_hours).to.eql(upDatePaycheck.vacation_hours);
          expect(res.body.sick_hours).to.eql(upDatePaycheck.sick_hours);
          const expectedDate = new Date().toLocaleString();
          const actualDate = new Date(res.body.date_modified).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        });
    });
    /* ================================================================*/
  });
});
