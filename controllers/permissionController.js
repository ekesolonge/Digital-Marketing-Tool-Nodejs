var permissionController = (app) => {
  const connection = require("../models/db");
  const {
    authenticate,
    managePermission,
  } = require("../middleware/authorization"); // authorization middleware

  // Get permission API
  app.get("/permission", authenticate, managePermission, (req, res) => {
    connection.query(`select * from permission`, (err, resp) => {
      if (err) throw err;
      res.send(resp);
    });
  });

  app.get("/permission/:id", authenticate, managePermission, (req, res) => {
    connection.query(
      `select * from permission where id = ${req.params.id}`,
      (err, resp) => {
        if (err || resp.length < 1)
          return res.status(404).send("Record does not exist.");
        res.send(resp[0]);
      }
    );
  });

  // Delete an permission API
  app.delete("/permission/:id", authenticate, managePermission, (req, res) => {
    connection.query(
      `delete from permission where id = ${req.params.id}`,
      (err, resp) => {
        if (err) return res.send(err);
        res.send("permission successfully deleted at ID " + req.params.id);
      }
    );
  });

  // REST API to Insert permission
  app.post("/permission", authenticate, managePermission, (req, res) => {
    if (
      !req.body.permissionName ||
      !req.body.permissionDescription ||
      !req.body.groupName
    )
      return res.status(400).send("Please fill all required fields");
  });

  //rest api to update permission into mysql database
  app.put("/permission/:id", authenticate, managePermission, (req, res) => {
    connection.query(
      `update permission set permissionName = '${req.body.permissionName}', permissionDescription = '${req.body.permissionDescription}',groupName = '${req.body.groupName}' where id=${req.params.id}`,
      (err, response) => {
        if (err) throw err;
        res.send("permission edited Successfully");
      }
    );
  });
};

module.exports = permissionController;
