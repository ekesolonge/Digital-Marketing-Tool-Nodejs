var roleController = (app) => {
  const connection = require("../models/db");
  const {
    authenticate,
    manageRole,
    manageUser,
  } = require("../middleware/authorization"); // authorization middleware

  // VIEW ROLES
  app.get("/role", authenticate, manageRole, (req, res) => {
    connection.query(`select * from role`, (err, resp) => {
      if (err) throw err;
      res.send(resp);
    });
  });

  // VIEW ROLES BY ID
  app.get("/role/:id", authenticate, manageRole, (req, res) => {
    connection.query(
      `select * from role where id = ${req.params.id}`,
      (err, resp) => {
        if (err || resp.length < 1)
          return res.status(404).send("Record does not exist.");
        res.send(resp[0]);
      }
    );
  });

  // DELETE ROLES
  app.delete("/role/:id", authenticate, manageRole, (req, res) => {
    connection.query(
      `delete from role where id = ${req.params.id}`,
      (err, resp) => {
        if (err) return res.send(err);
        res.send("role successfully deleted at ID " + req.params.id);
      }
    );
  });

  // CREATE ROLES
  app.post("/role", authenticate, manageRole, (req, res) => {
    if (!req.body.roleName || !req.body.roleDescription)
      return res.status(400).send("Please fill all required fields");

    connection.query(
      `insert into role (roleName,roleDescription) values 
              ('${req.body.roleName}',
              '${req.body.roleDescription}')`,
      (error, resp) => {
        if (error) return res.send(error.sqlMessage);
        res.send("role successfully created.");
        res.end();
      }
    );
  });

  // EDIT ROLES
  app.put("/role/:id", authenticate, manageRole, (req, res) => {
    let { roleName, roleDescription } = req.body;
    connection.query(
      `SELECT * FROM role WHERE id=${req.params.id}`,
      (err, db_res) => {
        if (err) {
          res.send(err);
        } else if (db_res.length < 1) {
          res.status(404).send(`Error! role does not exist.`);
        } else {
          let roles = db_res;
          if (roleName == undefined) roleName = roles[0].roleName;

          if (roleDescription == undefined)
            roleDescription = roles[0].roleDescription;
          connection.query(
            `update role set roleName = '${roleName}', roleDescription = '${roleDescription}' where id=${req.params.id}`,
            (err, response) => {
              if (err) throw err;
              res.send("role edited Successfully");
            }
          );
        }
      }
    );
  });

  // ASSIGN ROLE TO USER
  app.post(
    "/assignRole/:roleId/:userId",
    authenticate,
    manageRole,
    (req, res) => {
      let { roleId, userId } = req.params;
      if (!roleId || !userId)
        return res.status(400).send("Please input valid parameters");

      connection.query(
        `insert into user_role values 
              ('','${roleId}',
              '${userId}')`,
        (error, resp1) => {
          if (error) return res.send(error.sqlMessage);
          res.send(`User ID ${userId} has been assigned role ID ${roleId}`);
        }
      );
    }
  );
};

module.exports = roleController;
