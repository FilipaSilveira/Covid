const mongoose = require('mongoose');

const HomeSchema = mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    pass: {
        type: String,
        require: true
    }
});


module.exports = mongoose.model('tecnicos', HomeSchema);