const express = require("express");
const path = require("path");
const PaycheckService = require("./paycheck-service");
const { requireAuth } = require("../middleware/jwt-auth");

const paycheckRouter = express.Router();
const jsonBodyParser = express.json();

//paycheckRouter.route("/").get((req, res) => {
//res.json({ ok: true });
//});
/*
    id,
    paystub_date,
    ben_hours,
    vacation_hours,
    sick_hours,
    user_id,
    date_created,
    date_modified
*/

paycheckRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    PaycheckService.getAllPaychecks(req.app.get("db"))
      .then(paychecks => {
        res.json(PaycheckService.serializePaychecks(paychecks));
      })
      .catch(next);
  })

  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      paystub_date,
      ben_hours,
      vacation_hours,
      sick_hours,
      user_id,
      date_created,
      date_modified
    } = req.body;
    const newPaycheck = {
      paystub_date,
      ben_hours,
      vacation_hours,
      sick_hours
      //user_id
    };
    for (const [key, value] of Object.entries(newPaycheck))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newPaycheck.user_id = req.user.id;

    PaycheckService.insertPaycheck(req.app.get("db"), newPaycheck)
      .then(paycheck => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${paycheck.id}`))
          .json(PaycheckService.serializePaycheck(paycheck));
      })
      .catch(next);
  });

//================ (":/user_id" ENDPOINT) =========
paycheckRouter
  .route("/:paycheck_id")
  //.all(checkUserExists)
  .get((req, res) => {
    res.json(PaycheckService.serializePaycheck(res.paycheck));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const {
      paystub_date,
      ben_hours,
      vacation_hours,
      sick_hours,
      user_id,
      date_modified
    } = req.body;
    const userFieldsToUpdate = {
      paystub_date,
      ben_hours,
      vacation_hours,
      sick_hours,
      user_id,
      date_modified
    };

    const numberOfValues = Object.values(userFieldsToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res
        .status(400)
        .json({ error: `No changes were requested for updating paycheck.` });
    }

    PaycheckService.updatePaycheck(
      req.app.get("db"),
      req.params.paycheck_id,
      userFieldsToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

/* async/await syntax for promises 
async function checkUserExists(req, res, next) {
  try {
    const paycheck = await PaycheckService.getById(
      req.app.get("db"),
      req.params.uid
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
}*/

module.exports = paycheckRouter;
