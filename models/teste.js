const mongoose = require('mongoose');

const testeSchema = mongoose.Schema({
    testeStatus: {
        type: String,
        require: true
    },
    data: {
        type: Date
    },
    resultadoTeste: {
        type: String
    },
    pdf: {
        type: String
    }
});

module.exports = mongoose.model('teste', testeSchema);