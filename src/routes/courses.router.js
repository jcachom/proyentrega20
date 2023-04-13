let { Router } = require("express");
const router = Router();

let coursesManager = require("../dao/dbManagers/coursesdbManager");

let ocoursesManager = new coursesManager();

router.get("/", async (req, res) => {
  try {
    let result = await ocoursesManager.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", mensaje: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    let newCourse = {
      title,
      description,
      teacher: "sin asignar",
    };
    let result = await ocoursesManager.saveCourse(newCourse);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", mensaje: error.message });
  }
});

module.exports = router;
