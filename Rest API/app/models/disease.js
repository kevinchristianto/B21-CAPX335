const sql = require("../config/db")

const Disease = disease => {
    this.disease_id = disease.disease_id
    this.type = disease.type
    this.disease_name = disease.disease_name
    this.latin = disease.latin
    this.description = disease.description
}

Disease.findById = (id, result) => {
    sql.query(`SELECT * FROM diseases WHERE disease_id = ${id}; SELECT * FROM symptoms WHERE disease_id = ${id}; SELECT * FROM chemical_control WHERE disease_id = ${id}; SELECT * FROM treatments WHERE disease_id = ${id};`, (err, res) => {
        result(null, {
            brief: res[0][0],
            symptomps: res[1],
            cures: res[2],
            treatments: res[3]
        })

    })
}

Disease.findAll = result => {
    sql.query(`SELECT * FROM diseases;`, (err, data) => {
        result(null, data)
    })
}

module.exports = Disease