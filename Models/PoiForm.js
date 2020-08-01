const mongoose = require("mongoose");

const PoiForm = mongoose.model("PoiForm", {
  name: String,
  email: String,
  address: String,
  type: String,
  status: String,
  moderation: String,
});

module.exports = PoiForm;
