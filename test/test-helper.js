const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
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
}

function makePayStubsArray(users) {
  return [
    {
      id: 1,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 421,
      vacation_hours: 13,
      sick_hours: 8,
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 1,
      paystub_date: "2029-01-22T16:28:32.615Z",
      ben_hours: 421,
      vacation_hours: 13,
      sick_hours: 8,
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

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

function divide(a, b) {
  if (b == 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}

module.exports = {
  users,
  divide,
  makeUsersArray,
  makePayStubsArray
};
