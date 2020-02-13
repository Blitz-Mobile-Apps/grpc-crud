const usersData = require('../data/users');

module.exports = {
    getAll: (call) => {
        usersData.forEach(user => {
            call.write( { user } );
        });
        call.end();
    },
    getById: (call, callback) => {

        const id = call.request.id;
    
        const user = usersData.filter(user => user.id === id);
        
        if(!user.length) callback({ message: 'not found' });
    
        callback(null, {user: user.shift()});
    },
    addPhoto: (call, callback) => {
        const meta = call.metadata.getMap();
        for (const key in meta) {
            const element = meta[key];
            console.log(element);
        }
    
        let result = new Buffer.allocUnsafe(0);
        call.on('data', function(data){
            result = Buffer.concat([result, data.data]);
            console.log(`Message received with size ${data.data.length}`);
        });
        call.on('end', function(data){
            callback(null, { isOk: true });
            console.log(`Total fize size is: ${result.length} bytes`);
        })
    },
    saveAll: (call) => {
        call.on('data', function(user){
            usersData.push(user);
            call.write(user);
        });
        call.on('end', function(){
            // List all the user after saving all records - (for prove)
            usersData.forEach(user => console.log(user));

            call.end();
        })
    },
    save: (call, callback) => {
        const user = call.request.user;
        usersData.push(user);
        callback(null, {users: usersData});
    },
    delete: (call, callback) => {

        const id = call.request.id;
    
        const userIndex = usersData.findIndex(user => user.id === id);

        if(userIndex < 0) callback({ message: 'Invalid User ID' });
        
        usersData.splice(userIndex, 1);

        callback(null, {isOk: true, message: "User Deleted!"});
    },
    edit: (call, callback) => {

        const data = call.request.user;

        const userIndex = usersData.findIndex(u => u.id === data.id);

        if(userIndex < 0) callback({ message: 'Invalid User ID' });

        const user = usersData[userIndex];

        usersData[userIndex] = Object.assign(user, data);

        callback(null, {users: usersData});
    },
}