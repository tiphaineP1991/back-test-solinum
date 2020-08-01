// 1-Allow the server to communicate
require("dotenv").config();

// 2-Start my project
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// 3-Import my models
require("./Models/PoiForm");

// 4-Import my routes
const poiFormRoutes = require("./Routes/PoiForm");
app.use(poiFormRoutes);

// 5-Connect with my database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 6-Listen to my server

app.listen(process.env.PORT, () => {
  console.log("Server is up !");
});
