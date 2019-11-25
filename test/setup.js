process.env.JWT_SECRET = "test-jwt-secret";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";

require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;

/*
If using ESLint, add the following data to .eslintrc.js
"globals": {
    "supertest": true,
    "expect": true
}
*/
