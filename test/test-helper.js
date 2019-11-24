const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_email: "testUser1@gmail.com",
      password: "password",
      first_name: "Test1",
      last_name: "User1",
      state_location: "California",
      hours_padded: 5,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      user_email: "testUser2@gmail.com",
      password: "password",
      first_name: "Test2",
      last_name: "User2",
      state_location: "Alabama",
      hours_padded: 10,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      user_email: "testUser3@gmail.com",
      password: "password",
      first_name: "Test3",
      last_name: "User3",
      state_location: "Colorado",
      hours_padded: 15,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      user_email: "testUser4@gmail.com",
      password: "password",
      first_name: "Test4",
      last_name: "User4",
      state_location: "New York",
      hours_padded: 8,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 5,
      user_email: "testUser5@gmail.com",
      password: "password",
      first_name: "Test5",
      last_name: "User5",
      state_location: "Florida",
      hours_padded: 10,
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

function makePayStubsArray(users) {
  return [
    {
      id: 1,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 421.25,
      vacation_hours: 13.15,
      sick_hours: 8.75,
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 221.75,
      vacation_hours: 9.85,
      sick_hours: 8.65,
      user_id: users[1].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 321.25,
      vacation_hours: 10.75,
      sick_hours: 6.75,
      user_id: users[2].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 395.25,
      vacation_hours: 16.75,
      sick_hours: 14.65,
      user_id: users[3].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 5,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 495.25,
      vacation_hours: 26.75,
      sick_hours: 24.65,
      user_id: users[4].id,
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}
/*
users = [
  {
    id: 1,
    user_email: "testUser1@gmail.com",
    password: "password",
    first_name: "Test",
    last_name: "User",
    state_location: "California",
    hours_padded: 5,
    date_created: "2029-01-22T16:28:32.615Z"
  },
  {
    id: 2,
    user_email: "testUser2@gmail.com",
    password: "password",
    first_name: "Test",
    last_name: "User",
    state_location: "Alabama",
    hours_padded: 10,
    date_created: "2029-01-22T16:28:32.615Z"
  },
  {
    id: 3,
    user_email: "testUser3@gmail.com",
    password: "password",
    first_name: "Test",
    last_name: "User",
    state_location: "Colorado",
    hours_padded: 15,
    date_created: "2029-01-22T16:28:32.615Z"
  },
  {
    id: 4,
    user_email: "testUser4@gmail.com",
    password: "password",
    first_name: "Test",
    last_name: "User",
    state_location: "New York",
    hours_padded: 8,
    date_created: "2029-01-22T16:28:32.615Z"
  }
];
*/

function makePaycheckFixtures() {
  const testUsers = makeUsersArray();
  const testPaychecks = makePayStubsArray(testUsers);
  return { testUsers, testPaychecks };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE partnerben_paystubs, partnerben_users RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("partnerben_users")
    .insert(preppedUsers)
    .then(() =>
      //update the auto sequence to stay in sync
      db.raw(`SELECT setval('partnerben_users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

function seedTestTables(db, users, paystubs = []) {
  //return db
  //.into("thingful_users")
  //.insert(users)
  //.then(() => db.into("thingful_things").insert(things))
  //.then(() => reviews.length && db.into("thingful_reviews").insert(reviews));

  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into("partnerben_paystubs").insert(paystubs);
    //update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('partnerben_paystubs_id_seq', ?)`, [
      paystubs[paystubs.length - 1].id
    ]);
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  //const token = Buffer.from(`${user.user_name}:${user.password}`).toString("base64");
  //return `Basic ${token}`;
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_email,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

function divide(a, b) {
  if (b == 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}

module.exports = {
  //users,
  cleanTables,
  seedUsers,
  divide,
  makeUsersArray,
  makePayStubsArray,
  makeAuthHeader,
  makePaycheckFixtures,
  seedTestTables
};
