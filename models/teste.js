//não por nome nem codigo
//

const mongoose = require('mongoose');

const testeSchema = mongoose.Schema({
    estado: {
        type: String,
        require: true
    },
    teste: {
        type: String,
        require: true
    },
    data: {
        type: Date
    },
    resultado: {
        type: String
    }
});


module.exports = mongoose.model('teste', testeSchema);