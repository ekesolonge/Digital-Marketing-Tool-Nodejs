const express = require("express"); // express module
const bodyParser = require("body-parser"); // body-parser middleware

// Routes
const users = require("./routes/users");
const emailTemplate = require("./routes/emailTemplates");
const audience = require("./routes/audience");
const contactUs = require("./routes/contactUs");
const newsletter = require("./routes/newsletter");

const suggestions = require("./controllers/suggestions"); //Suggestions Controller
const reply = require("./controllers/reply"); //Reply Controller
const billing_info = require("./controllers/billing_info"); //Reply Controller
const payment = require("./controllers/payment"); // payment module
const stickyNote = require("./controllers/sticky_note"); // stickyNote module
const subscriber_group = require("./controllers/subscriber_group"); //subscriber_group module
const roleController = require("./controllers/roleController"); //roleController module
const permissionController = require("./controllers/permissionController"); //permissionController module

// Dynamic port listener
const port = process.env.PORT || 3000; // set port
const app = express(); // express init
app.use(bodyParser.json()); // Middleware use with express

// Routes
app.use("/api/users", users);
app.use("/api/emailTemplates", emailTemplate);
app.use("/api/audience", audience);
app.use("/api/contactUs", contactUs);
app.use("/api/newsletter", newsletter);

suggestions(app);
reply(app);
billing_info(app);
payment(app);
stickyNote(app);
subscriber_group(app);
roleController(app);
permissionController(app);

// Listen on port
app.listen(port, () => console.log(`Listening on port ${port}...`));
