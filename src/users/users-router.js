const express = require("express");
const path = require("path");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

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
usersRouter.route("/").get((req, res) => {
  res.json({ ok: true });
});

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const {
    user_email,
    password,
    first_name,
    last_name,
    state_location
  } = req.body;
  for (const field of [
    "user_email",
    "password",
    "first_name",
    "state_location"
  ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithEmail(req.app.get("db"), user_email)
    .then(hasUserWithEmail => {
      if (hasUserWithEmail)
        return res
          .status(400)
          .json({ error: "Email already exists, please sign in." });

      return UsersService.hashPassword(password).then(hashPassword => {
        const newUser = {
          user_email,
          password: hashPassword,
          first_name,
          last_name,
          state_location,
          date_created: "now()"
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
      //res
      //.status(201)
      //.location(path.posix.join(req.originalUrl, "/whatever"))
      //.json({
      // id: "whatever",
      //user_name,
      //full_name,
      //nickname: nickname || "",
      //date_created: Date.now()
      //})
    })
    .catch(next);
});

module.exports = usersRouter;
