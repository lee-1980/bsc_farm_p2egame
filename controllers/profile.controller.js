const Profile = require('../models/profile.model');
const { POST_PROFILE, UPDATE_PROFILE, DELETE_PROFILE, FETCH_SINGLE_USER } = require('../actions/profile.action');
const authenticate = require('../middleware/auth')

async function profileController(ws, socket, message) {
    const body =  JSON.parse(message);
    const authorized = await authenticate(body.token);
        
    switch(body.type) {
        case POST_PROFILE: 
                if(!authorized) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'Sorry access to resource denied'}));

                let profile = new Profile({
                    userid: body.data.userid,
                    firstname: body.data.firstname,
                    middlename: body.data.middlename,
                    lastname: body.data.lastname             
                });

                await profile.save();

                ws.clients.forEach(async function e(client) {
                    const fetchProfile = await Profile.find();
                    const resProfile = JSON.stringify({allProfile: fetchProfile});
                    client.send(resProfile);
                    return client.send(JSON.stringify({code: 200, status: 'success', message: 'Profile saved'}));
                });

            break;


        case DELETE_PROFILE:
            if(!authorized) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'Sorry access to resource denied'}));

            const profiledel = await Profile.findByIdAndRemove(body.params);
            if (!profiledel) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'Sorry profile doesnt exit'}));
    
            const fetchProfile = await Profile.find();
            const resProfile = JSON.stringify({allProfile: fetchProfile});
            socket.send(resProfile);
            return socket.send(JSON.stringify({code: 200, status: 'success', message: 'Profile deleted successfuly'}));
            // break;

        case FETCH_SINGLE_USER:
                if(!authorized) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'Sorry access to resource denied'}));
                const fetchSingleProfile = await Profile.findOne({"_id": body.params});
                const resSingleProfile = JSON.stringify({singleProfile: fetchSingleProfile});
                return socket.send(resSingleProfile);
            break;
            
        case UPDATE_PROFILE: 
                if(!authorized) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'Sorry access to resource denied'}));

                const Updateprofile = await Profile.findByIdAndUpdate(body.params, {
                    userid: body.data.userid,
                    firstname: body.data.firstname,
                    middlename: body.data.middlename,
                    lastname: body.data.lastname,
                    new: true
                });
                if (!Updateprofile) return socket.send(JSON.stringify({code: 400, status: 'error', message: 'Sorry profile not updated'}));
        
                ws.clients.forEach(async function e(client) {
                    const fetchProfile = await Profile.find();
                    const resProfile = JSON.stringify({allProfile: fetchProfile});
                    client.send(resProfile);
                    return socket.send(JSON.stringify({code: 200, status: 'success', message: 'Profile updated successfuly'}));
                });

            break;
    }
};

async function preloadProfile(socket) {
    const fetchProfile = await Profile.find();
    const resProfile = JSON.stringify({allProfile: fetchProfile});
    socket.send(resProfile);
}

module.exports = {
    profileController,
    preloadProfile
} 