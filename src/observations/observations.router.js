const router = require("express").Router({ mergeParams: true });
const controller = require("./observations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:observationId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
