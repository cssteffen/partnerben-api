module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  DB_URL: process.env.DB_URL,
  TEST_DB_URL: process.env.DB_URL,
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api"
};
