const Disease = require("../models/disease")

exports.findOne = (req, res) => {
    Disease.findById(req.params.id, (err, data) => {
        res.json(data)
    })
}

exports.findAll = (req, res) => {
    Disease.findAll((err, data) => {
        res.json(data)
    })
}