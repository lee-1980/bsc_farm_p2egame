const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authenticate(tokenVaue) {
    // if (!tokenVaue) return socket.send(JSON.stringify({code: 400, status: 'access error', message: 'Authentication failed'}));
    try {
        const decoded = jwt.verify(tokenVaue, process.env.PRIVATE_KEY);
        const findUser = await User.findOne({"email": decoded.email});
        if(findUser) return true;
    } catch (error) {
        return  false
    }
}

module.exports = authenticate;