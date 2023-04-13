let { Router } = require("express");
const router = Router();

router.get("/setcookie", (req, res) => {
  try {
    res
      .cookie("codercookie", "Esto es cookie", { maxAge: 10000, signed: true })
      .send("cookie");
  } catch (error) {
    console.log(error);
  }
});

router.get("/getcookie", (req, res) => {
  try {
    console.log(req.signedCookies);
    res.send(req.signedCookies);
  } catch (error) {
    console.log(error);
  }
});

router.get("/deletecookie", (req, res) => {
  try {
    res.clearCookie("codercookie").send("cookie eliminado");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
