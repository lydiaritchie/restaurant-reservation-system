const knex = require("../db/connection");

const tableName = "tables";

async function createTable(newTable){
    return knex(tableName)
        .insert(newTable)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

async function listTables(){
    return knex(tableName).select("*");
}

module.exports ={
    createTable,
    listTables,
}