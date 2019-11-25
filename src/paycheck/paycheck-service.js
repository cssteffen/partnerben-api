const xss = require("xss");

const PaycheckService = {
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
  getAllPaychecks(db) {
    return db
      .from("partnerben_paystubs AS pay")
      .select(
        "pay.id",
        "pay.paystub_date",
        "pay.ben_hours",
        "pay.sick_hours",
        "pay.user_id",
        "pay.date_created",
        "pay.date_modified",
        ...userFields
      )
      .leftJoin("partnerben_users AS usr", "pay.user_id", "usr.id")
      .groupBy("pay.id", "usr.id");
  },
  getById(db, id) {
    return db
      .from("partnerben_paystubs AS pay")
      .select(
        "pay.id",
        "pay.paystub_date",
        "pay.ben_hours",
        "pay.vacation_hours",
        "pay.sick_hours",
        "pay.date_created",
        "pay.date_modified",
        db.raw(
          `row_to_json(
                (SELECT tmp FROM (
                  SELECT
                    usr.id,
                    usr.user_email,
                    usr.first_name,
                    usr.last_name,
                    usr.state_location,
                    usr.hours_padded,
                    usr.date_created,
                    usr.date_modified
                ) tmp)
              ) AS "user"`
        )
      )
      .leftJoin("partnerben_users AS usr", "pay.user_id", "usr.id")
      .where("pay.id", id)
      .first();
  },

  insertPaycheck(db, newPaycheck) {
    return db
      .insert(newPaycheck)
      .into("partnerben_paystubs")
      .returning("*")
      .then(([paycheck]) => paycheck)
      .then(paycheck => PaycheckService.getById(db, paycheck.id));
  },

  serializePaychecks(paychecks) {
    return paychecks.map(this.serializePaycheck);
  },

  serializePaycheck(paycheck) {
    return {
      id: paycheck.id,
      paystub_date: new Date(paycheck.paystub_date),
      ben_hours: xss(paycheck.ben_hours),
      vacation_hours: xss(paycheck.vacation_hours),
      sick_hours: xss(paycheck.sick_hours),
      user_id: paycheck.user_id,
      date_created: new Date(paycheck.date_created),
      date_modified: new Date(paycheck.date_modified)
    };
  },

  updatePaycheck(db, id, newUserFields) {
    return db("partnerben_paystubs")
      .where({ id })
      .update(newUserFields);
  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_email AS user:user_email",
  "usr.first_name AS user:first_name",
  "usr.last_name AS user:last_name",
  "usr.state_location AS user:state_location",
  "usr.hours_padded AS user:hours_padded",
  "usr.date_created AS user:date_created",
  "usr.date_modified AS user:date_modified"
];

module.exports = PaycheckService;
