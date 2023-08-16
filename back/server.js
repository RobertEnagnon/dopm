require('dotenv').config() // chargement des variables d'environnements
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const multer = require("multer");
const session = require('express-session')
const { authJwt, passport } = require("./middleware");
const whitelist = ['https://sso.sodigitale.fr', 'https://sso.sodigitale.fr/adfs/ls/idpinitiatedsignon.aspx', 'http://localhost:8080/', 'http://dopm-dev.sodigitale.fr/', 'https://dopm-dev.sodigitale.fr/', 'http://176.159.179.86/'];
const fileUpload = require("express-fileupload");

const pathImage = __dirname + "/public/images/";
var cookieParser = require('cookie-parser');
const app = express();

const PATH = __dirname + "/public";

app.use(express.static(__dirname + "/public"));
app.use(compression());
app.use(fileUpload());
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = {
  corsOptions: cors(corsOptions),
};

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

require("./routes/ad.routes")(app);

app.use(authJwt.verifyToken);
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/top5/category.routes")(app);
require("./routes/top5/curve.routes")(app);
require("./routes/chart.routes")(app);
require("./routes/top5/data.routes")(app);
require("./routes/top5/historical.routes")(app);
require("./routes/top5/indicator.routes")(app);
require("./routes/top5/target.routes")(app);
require("./routes/top5/link.routes")(app);
require("./routes/top5/branch.routes")(app);
require("./routes/top5/setting.routes")(app);
require("./routes/service.routes")(app);
require("./routes/team.routes")(app);
require("./routes/zone.routes")(app);
require("./routes/subzone.routes")(app);
require("./routes/responsible.routes")(app);
require("./routes/fiche_securite/fichesecurite.routes")(app);
require("./routes/fiche_securite/fscategory.routes")(app);
require("./routes/fiche_securite/fsnotifications.routes")(app);
require("./routes/fiche_securite/classification.routes")(app);
require("./routes/versions.routes")(app);
require("./routes/audit_terrain/at_audit.routes")(app);
require("./routes/audit_terrain/at_category.routes")(app);
require("./routes/audit_terrain/at_checkpoint.routes")(app);
require("./routes/audit_terrain/at_evaluation.routes")(app);
require("./routes/dashboard/board.routes")(app);
require("./routes/dashboard/dashboard.routes")(app);
require("./routes/sugcategory.routes")(app);
require("./routes/sugclassification.routes")(app);
require("./routes/sugworkflow.routes")(app);
require("./routes/suggestion.routes")(app);
require("./routes/language.routes")(app);
require("./routes/rights_groupes.routes")(app);
require("./routes/rights_permissions.routes")(app);
require("./routes/rights_groupes_permissions.routes")(app);
require("./routes/rights_user_groupes.routes")(app);
require("./routes/rights_user_permissions.routes")(app);
require("./routes/assignation/as_board.routes")(app);
require("./routes/assignation/as_table.routes")(app);
require("./routes/assignation/as_task.routes")(app);
require('./routes/assignation/as_category.routes')(app);
require('./routes/assignation/as_checklist.routes')(app);
require('./routes/assignation/as_file.routes')(app);
require('./routes/assignation/as_responsible.routes')(app);
require('./routes/assignation/as_task_conversation.routes')(app);
require("./routes/period.routes")(app);
require("./routes/fiche_infirmerie/ficheinfirmerie.routes")(app);
require("./routes/fiche_infirmerie/fiInjuredCategory.routes")(app);
require("./routes/fiche_infirmerie/fiMaterialElements.routes")(app);
require("./routes/fiche_infirmerie/fiLesionDetails.routes")(app);
require("./routes/fiche_infirmerie/fiCareProvided.routes")(app);
require("./routes/fiche_infirmerie/fiClassification.routes")(app);
require("./routes/fiche_infirmerie/fiNotifications.routes")(app);

// require("./routes/pdca.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
