const knex = require("../db/connection");

function create(newObservation) {
  return knex("observations").insert(newObservation).returning("*");
}

async function list() {
  return knex("observations").select("*");
}

async function read(observationId) {
  return knex("observations")
    .select("*")
    .where({ observation_id: observationId });
}

async function update(observationId, editedObservation) {
  return knex("observations")
    .select("*")
    .where({ observation_id: observationId })
    .update(editedObservation, "*");
}

module.exports = {
  create,
  list,
  read,
  update,
};
