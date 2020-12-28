const express = require("express"); // express module
const router = express.Router(); // router
const connection = require("../models/db"); // database module
const { authenticate } = require("../middleware/authorization"); // authorization middleware
const Joi = require("joi"); // validator
const { route } = require("./users");

// subscribe to newsletter
router.post("/", (req, res) => {
  const { error } = validateTemplate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // INSERT into database
  connection.query(
    `insert into newsletter values('','${req.body.email}')`,
    (err, resp) => {
      if (err) return res.status(400).send(err);
      res.send("You have subscribed to MartReach newsletter successfully");
    }
  );
});

// GET
router.get("/", authenticate, (req, res) => {
  connection.query(`select * from newsletter`, (err, resp) => {
    if (err) throw err;
    res.send(resp);
  });
});

// Get by id
router.get("/:id", authenticate, (req, res) => {
  connection.query(
    `select * from newsletter where id = ${req.params.id}`,
    (err, resp) => {
      if (err || resp.length < 1)
        return res.status(404).send("Record does not exist.");
      res.send(resp[0]);
    }
  );
});

// DELETE
router.delete("/:id", authenticate, (req, res) => {
  connection.query(
    `delete from newsletter where id = ${req.params.id}`,
    (err, resp) => {
      if (resp.affectedRows === 0)
        return res.status(404).send("Record does not exist.");
      if (err) return res.send(err);
      res.send("Email successfully deleted from newsletter list.");
    }
  );
});

function validateTemplate(template) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  });

  return schema.validate(template);
}

module.exports = router;
