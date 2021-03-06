const payment = (app) => {
  const connection = require("../models/db"); // database module
  const { authenticate } = require("../middleware/authorization"); // authorization middleware
  const { v4: uuidv4 } = require("uuid"); //uuid module for generating universally unique identifiers used for transaction id

  // Get payment details by id
  app.get("/payment/:id", authenticate, (req, res) => {
    connection.query(
      `select * from payments where id = ${req.params.id}`,
      (err, resp) => {
        if (err || resp.length < 1)
          return res.status(404).send("Payment Details does not exist.");
        res.send(resp[0]);
      }
    );
  });

  // Create new payment detail
  app.post("/payment", authenticate, (req, res) => {
    const uuid = uuidv4();

    // INSERT into database
    connection.query(
      `insert into payments (userId,reference) values('${req.user.data.userId}','${uuid}')`,
      (err, resp) => {
        if (err) return res.status(400).send(err);
        res.send("Payment details created successfully.");
      }
    );
  });

  // DELETE payment Details
  app.delete("/payment/:id", authenticate, function (req, res) {
    connection.query(
      `delete from payments where id = ${req.params.id}`,
      (err, resp) => {
        if (resp.affectedRows === 0)
          return res.status(404).send("Template does not exist.");
        if (err) return res.send(err);
        res.send("Payment details successfully deleted.");
      }
    );
  });
};

module.exports = payment;
