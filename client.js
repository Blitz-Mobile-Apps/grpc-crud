'use strict';

const PROTO_PATH = "./protos/user.proto";
const protoLoader = require('@grpc/proto-loader')

const fs = require('fs');
const grpc = require('grpc');
const serviceDef = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO_PATH));
const PORT  = 9000;

const cacert = fs.readFileSync(__dirname + '/certs/ca.crt'),
        cert = fs.readFileSync(__dirname + '/certs/client.crt'),
        key  = fs.readFileSync(__dirname + '/certs/client.key');

const creds = grpc.credentials.createSsl(cacert, key, cert);
const client = new serviceDef.UserService(`localhost:${PORT}`, creds);

const option = parseInt(process.argv[2], 10);

switch (option) {
    case 1:
        getById();
        break;
    case 2:
        getAll();
        break;
    case 3:
        addPhoto();
        break;
    case 4:
        save();
        break;
    case 5:
        saveAll();
        break;
    case 6:
        deleteById();
        break;
    case 7:
        edit();
        break;
}

function getById() {
    client.getById({ id: 1 }, function(error, response){
        if(error){
            console.log(error)
            return;
        }
        console.log(response.user)
    });
}

function getAll() {
    const call = client.getAll({});

    call.on('data', function(data){
        console.log(data.user);
    });
}

function addPhoto() {
    const call = client.addPhoto({}, function(error, response){
        console.log(response);
    });

    const stream = fs.createReadStream(__dirname + '/penguins.jpg');

    stream.on('data', function(chunk){
        call.write({ data: chunk })
    });

    stream.on('end', function () {
        call.end();
    })
}

function save(){
    const user = {
            id: 6,
            name: 'Scott L Jordon',
            email: "scottljordon@mailinator.com",
            phone: "916-224-5842",
        };

    client.save({user}, function(error, response){
        if(error){
            console.log(error);
            return;
        }
        console.log(response);
    });
}

function saveAll(){
    const users = [
        {
            id: 6,
            name: 'Alyssa A Vest',
            email: "alyssaavest@outlook.com",
            phone: "715-370-2789",
        },
        {
            id: 7,
            name: 'Terrence D Hilley',
            email: "terrencedhilley@outlook.com",
            phone: "913-230-3631",
        }
    ];


    const call = client.saveAll();

    call.on('data', function (user) {
        console.log(user);
    })

    users.forEach( user => call.write({user: user}));

    call.end();
}

function edit(){
    const user = {
        id: 1,
        name: 'Tammie C Fortner',
        email: 'tammiecfortner@mailinator.com',
        phone: '785-249-2989'
    };
    client.edit({ user }, function(error, response) {
        if(error)
        {
            console.log(error)
            return;
        }
        console.log(response);
    })
}

function deleteById(){
    client.delete({ id: 1 }, function(error, response) {
        if(error)
        {
            console.log(error)
            return;
        }
        console.log(response);
    })
}