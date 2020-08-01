const express = require("express");
const router = express.Router();
const mailgun = require("mailgun-js");

API_KEY = process.env.MAILGUN_API_KEY;
DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

const PoiForm = require("../Models/PoiForm");
const adminMail = "tiphaine.pellet@essec.edu";

//----------------CREATE-------------------
router.post("/poiForm/create", async (req, res) => {
  try {
    const newPoiForm = await new PoiForm({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      type: req.body.type,
      status: req.body.status,
      moderation: req.body.moderation,
    });
    newPoiForm.save();
    res.json(newPoiForm);
    mg.messages()
      .send({
        from: "Mailgun Sandbox <postmaster@" + DOMAIN + ">",
        to: adminMail,
        subject: "Nouvel ajout de POI",
        text:
          "Bonjour, un nouveau POI a été ajouté. Voici les données renseignées" +
          newPoiForm,
      })
      .then(() => {
        console.log("message sent");
      })
      .catch((error) => {
        console.log({ message: error.message });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --------------READ ALL-------------------
router.get("/poiForms", async (req, res) => {
  try {
    const poiForms = await PoiForm.find();
    res.json({ poiForms });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// --------------READ BY ID-------------------
router.get("/poiForm/:id", async (req, res) => {
  try {
    const poiForm = await PoiForm.findById(req.params.id);
    if (poiForm) {
      res.json(poiForm);
    } else {
      res.status(404).json("poi not found");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// --------------UPDATE-------------------
router.post("/poiForms/update", async (req, res) => {
  try {
    const updatePoiForm = await PoiForm.findById(req.query.id);
    if (updatePoiForm) {
      if (req.body.name) {
        updatePoiForm.name = req.body.name;
      }
      if (req.body.email) {
        updatePoiForm.email = req.body.email;
      }
      if (req.body.adress) {
        updatePoiForm.address = req.body.address;
      }
      if (req.body.type) {
        updatePoiForm.type = req.body.type;
      }
      if (req.body.status) {
        updatePoiForm.status = req.body.status;
      }
      if (req.body.moderation) {
        updatePoiForm.moderation = req.body.moderation;
      }
      await updatePoiForm.save();
      res.json(updatePoiForm);
    } else {
      res.status(404).json("poi not found");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// --------------VALIDATE-------------------
router.post("/poiForms/validation", async (req, res) => {
  try {
    const updatePoiFormValidation = await PoiForm.findById(req.query.id);
    if (updatePoiFormValidation) {
      if (req.body.moderation) {
        updatePoiFormValidation.moderation = req.body.moderation;
      }
      if (req.body.status) {
        updatePoiFormValidation.status = req.body.status;
      }
      await updatePoiFormValidation.save();
      res.json(updatePoiFormValidation);
      if (updatePoiFormValidation.moderation === "incomplete") {
        mg.messages()
          .send({
            from: "Mailgun Sandbox <postmaster@" + DOMAIN + ">",
            to: adminMail,
            subject: "POI incomplete",
            text:
              "Bonjour, le POI " +
              updatePoiFormValidation.name +
              "est incomplet",
          })
          .then(() => {
            console.log("message sent");
          })
          .catch((error) => {
            console.log({ message: error.message });
          });
      }
    } else {
      res.status(404).json("poi not found");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// --------------DELETE-------------------
router.post("/poiForms/delete", async (req, res) => {
  try {
    const deletePoiForm = await PoiForm.findById(req.query.id);
    if (deletePoiForm) {
      await deletePoiForm.remove();
      res.json("product removed");
    } else {
      res.status(404).json("poi not found");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
