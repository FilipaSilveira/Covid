//por campos 
//array de testes -->testes.js

const mongoose = require('mongoose');

const pacienteSchema = mongoose.Schema({
    cod: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    sex: {
        type: String,
        require: true
    },
    sintomas: {
        type: String,
        require: true
    }
});


module.exports = mongoose.model('paciente', pacienteSchema);