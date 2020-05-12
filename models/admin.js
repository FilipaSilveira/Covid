const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    cod: {
        type: Number,
        require: true
    },
    pass: {
        type: String,
        require: true
    }
});


module.exports = mongoose.model('Admin', adminSchema);