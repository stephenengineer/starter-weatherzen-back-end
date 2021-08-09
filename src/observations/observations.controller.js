const service = require("./observations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validSkyConditions = [100, 101, 102, 103, 104, 106, 108, 109];

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
}

function hasLatitude(req, res, next) {
  const latitude = Number(req.body.data.latitude);
  if (latitude >= -90 && latitude <= 90) {
    return next();
  }
  next({ status: 400, message: "latitude must be between -90 and 90" });
}

function hasLongitude(req, res, next) {
  const longitude = Number(req.body.data.longitude);
  if (longitude >= -180 && longitude <= 180) {
    return next();
  }
  next({ status: 400, message: "longitude must be between -180 and 180" });
}

function hasSkyCondition(req, res, next) {
  const skyCondition = Number(req.body.data.sky_condition);

  if (validSkyConditions.includes(skyCondition)) {
    return next();
  }
  next({
    status: 400,
    message: `sky_condition must be one of: ${validSkyConditions}`,
  });
}

function hasTemperature(req, res, next) {
  const temperature = Number(req.body.data.air_temperature);
  const temperatureUnit = req.body.data.air_temperature_unit;
  if (temperatureUnit !== "C" && temperatureUnit !== "F") {
    next({
      status: 400,
      message: `air_temperature_unit must be C or F`,
    });
  }
  if (temperatureUnit === "C") {
    return temperature >= -50 && temperature <= 107
      ? next()
      : next({
          status: 400,
          message: `if the temperature unit is C, air_temperature must be between -50 and 107`,
        });
  }
  return temperature >= -60 && temperature <= 224
    ? next()
    : next({
        status: 400,
        message: `if the temperature unit is F, air_temperature must be between -60 and 224`,
      });
}

async function observationExists(req, res, next) {
  const result = await service.read(req.params.observationId);
  if (result.length) {
    res.locals.observation = result[0];
    return next();
  }
  return next({
    status: 404,
    message: `Observation with id ${req.params.observationId} not found`,
  });
}

async function create(req, res) {
  const newObservation = await service.create(req.body.data);

  res.status(201).json({
    data: newObservation,
  });
}

async function list(req, res) {
  const data = await service.list();
  res.json({
    data,
  });
}

async function read(req, res) {
  const data = res.locals.observation;
  res.json({ data });
}

async function update(req, res) {
  const editedObservation = await service.update(
    res.locals.observation.observation_id,
    req.body.data
  );
  res.json({
    data: editedObservation,
  });
}

module.exports = {
  create: [
    hasData,
    hasLatitude,
    hasLongitude,
    hasSkyCondition,
    hasTemperature,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(observationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(observationExists),
    hasData,
    hasLatitude,
    hasLongitude,
    hasSkyCondition,
    hasTemperature,
    asyncErrorBoundary(update),
  ],
};
