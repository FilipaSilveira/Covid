//array de testes -->teste.js

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
    prioritario: {
        type: Boolean,
    },
    sintomas: {
        type: String,
    },
    estado: {
        type: String,
        require: true
    },
    testes:{ 
        type: Array,
        required: true,
        "default": [] 
    }
});


module.exports = mongoose.model('paciente', pacienteSchema);