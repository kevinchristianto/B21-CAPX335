module.exports = app => {
    const disease = require("../controllers/disease.js")

    app.get("/disease", disease.findAll)
    app.get("/disease/:id", disease.findOne)
}