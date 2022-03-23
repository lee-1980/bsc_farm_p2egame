const User = require('../models/user.model');
const { SIGNIN, LOGIN, LOGOUT} = require('../actions/user.action');
const jwt = require('jsonwebtoken');

async function userController(ws, socket, message) {
    const body =  JSON.parse(message);
        
    switch(body.type) {
        case SIGNIN: 
            const findUser = await User.findOne({"email": body.data.email});
            if (findUser) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'user already exists'}));

            let user = new User({ 
                email: body.data.email,
                password: body.data.password,
            });

            await user.save();
            return socket.send(JSON.stringify({code: 200, status: 'error', message: 'user created'}));
            break;

        case LOGIN: 
            const userLogin = await User.findOne({"email": body.data.email});
            console.log(userLogin);
            if (!userLogin) return socket.send(JSON.stringify({code: 401, status: 'error', message: 'Sorry account doesnt exit'}));

            if (userLogin.password !== body.data.password) {
                return socket.send(JSON.stringify({code: 401, status: 'error', message: 'Sorry wrong credentials'}));
            }

            // const payload = ["_id": userLogin._id, "email": userLogin.email];
            const token = jwt.sign(
                {_id: userLogin._id, email: userLogin.email},
                process.env.PRIVATE_KEY
            );
            return socket.send(JSON.stringify({'jwtToken': token}));
            break;
    
        default:
                break;
    }
};


async function preloadUsers(socket) {
    const fetchUsers = await User.find();
    const resUsers = JSON.stringify({allUsers: fetchUsers});
    socket.send(resUsers);
}

module.exports = {
    userController,
    preloadUsers
}