const xss = require("xss");
const bcrypt = require("bcryptjs");
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  hasUserWithEmail(db, user_email) {
    return db("partnerben_users")
      .where({ user_email })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("partnerben_users")
      .returning("*")
      .then(([user]) => user);
  },

  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  /*
    id 
    user_email 
    password 
    first_name 
    last_name 
    state_location 
    hours_padded 
    date_created 
    date_modified
*/
  getAllUsers(db) {
    return db
      .from("partnerben_users AS usr")
      .select(
        "usr.id",
        "usr.user_email",
        "usr.password",
        "usr.first_name",
        "usr.last_name",
        "usr.state_location",
        "usr.hours_padded",
        "usr.date_created",
        "usr.date_modified",
        ...userFields,
        db.raw(`count(DISTINCT pay) AS number_of_paychecks`)
      )
      .leftJoin("partnerben_paystubs AS pay", "usr.id", "pay.user_id")
      .groupBy("usr.id");
  },

  getById(db, id) {
    return UsersService.getAllUsers(db)
      .where("usr.id", id)
      .first();
  },

  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      last_name: xss(user.last_name),
      state_location: xss(user.state_location),
      hours_padded: 5,
      date_created: new Date(user.date_created),
      date_modified: new Date(user.date_modified)
    };
  },

  deleteUser(db, id) {
    return db("partnerben_users")
      .where({ id })
      .delete();
  },

  updateUser(db, id, newUserFields) {
    return db("partnerben_users")
      .where({ id })
      .update(newUserFields);
  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_email AS user:user_email",
  "usr.password AS user:password",
  "usr.first_name AS user:first_name",
  "usr.last_name AS user:last_name",
  "usr.state_location AS user:state_location",
  "usr.hours_padded AS user:hours_padded",
  "usr.date_created AS user:date_created",
  "usr.date_modified AS user:date_modified"
];

module.exports = UsersService;
