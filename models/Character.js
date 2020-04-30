const mongoose = require('mongoose');


const CharacterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    portrayed: {
        type: String,
        required: true
    },
    background: {
        type: String,
        required: false
    },
    personality : {
        type: String,
        required: false
    }
});


module.exports = mongoose.model('Character', CharacterSchema);