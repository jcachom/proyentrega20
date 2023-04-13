let { Router } = require("express");
const router = Router();

let userManager = require("../dao/dbManagers/usersdbManager");

let ouserManager = new userManager();

router.get("/", async (req, res) => {
  try {
    let result = await ouserManager.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", mensaje: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, birthDate, gender } = req.body;

    if (!first_name || !last_name || !email)
      res.send({ status: "error", error: "Incomplete valores" });

    let newUser = {
      first_name,
      last_name,
      email,
      birthDate,
      gender,
    };
    let result = await ouserManager.saveUser(newUser);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", mensaje: error.message });
  }
});

router.put("/:uid", async (req, res) => {
  try {
    let { uid } = req.params;
    let userToReplace = req.body;
    if (
      !userToReplace.first_name ||
      !userToReplace.last_name ||
      !userToReplace.email
    )
      res.send({ status: "error", error: "Incomplete valores" });

    let result = await userModel.updateOne({ _id: uid }, userToReplace);

    res.send({ result: "succes", payload: result });
  } catch (error) {
    res.send({ result: "error", error: error });
  }
});

router.delete("/:uid", async (req, res) => {
  try {
    let { uid } = req.params;
    let result = await userModel.deleteOne({ _id: uid });

    res.send({ status: "succes", payload: result });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

module.exports = router;
