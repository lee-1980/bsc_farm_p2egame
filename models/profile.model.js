const mongoose = require('mongoose');

const Profile = mongoose.model('Profile',  new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    }
}));

module.exports = Profile;