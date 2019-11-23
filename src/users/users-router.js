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
          date_created: new Date(),
          date_modified: new Date()
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

//================ (":/user_id" ENDPOINT) =========
usersRouter
  .route("/:user_id")
  .all(checkUserExists)
  .get((req, res) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete((req, res, next) => {
    const db = req.app.get("db");
    const id = req.params.user_id;
    UsersService.deleteUser(db, id)
      .then(() => {
        res.json(`User with id ${id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const {
      user_email,
      password,
      first_name,
      last_name,
      state_location,
      hours_padded,
      date_modified
    } = req.body;
    const userFieldsToUpdate = {
      user_email,
      password,
      first_name,
      last_name,
      state_location,
      hours_padded,
      date_modified
    };
    const numberOfValues = Object.values(userFieldsToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res
        .status(400)
        .json({ error: `No changes were requested for updating user.` });
    }
    /* ======= NEED HELP VALIDATING UPDATED PASSWORD ========== *
    if(userFieldsToUpdate.includes(password)) {
        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        } 
        return UsersService.hashPassword(password).then(hashPassword => {
            const userWithPasswordUpdate = {
                password: hashPassword,
                ...userFieldsToUpdate
            };
            userFieldsToUpdate = userWithPasswordUpdate;
        }
    }
    /* ===============================================================*/
    UsersService.updateUser(
      req.app.get("db"),
      req.params.user_id,
      userFieldsToUpdate
    )
      .then(() => {
        res
          //.json(`Changes saved.`)
          .status(204)
          .end();
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getById(
      req.app.get("db"),
      req.params.user_id
    );

    if (!user)
      return res.status(404).json({
        error: `User doesn't exist`
      });

    res.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = usersRouter;
