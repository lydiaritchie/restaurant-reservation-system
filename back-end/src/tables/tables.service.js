const knext = require("../db/connection");

const tableName = "tables";

async function createTable(newTable){
    return knext(tableName)
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