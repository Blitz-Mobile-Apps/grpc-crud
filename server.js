'use strict';

const PROTO_PATH = "protos/user.proto";
const protoLoader = require('@grpc/proto-loader')

const fs = require('fs');
const grpc = require('grpc');
const serviceDef = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO_PATH));
const PORT  = 9000;

const cacert = fs.readFileSync(__dirname + '/certs/ca.crt'),
        cert = fs.readFileSync(__dirname + '/certs/server.crt'),
        key  = fs.readFileSync(__dirname + '/certs/server.key');

const kvpair = {
    'private_key': key,
    'cert_chain' : cert
}

const UserService = require('./services/UserService');

const creds = grpc.ServerCredentials.createSsl(cacert, [kvpair]);

const server = new grpc.Server();

server.addService(serviceDef.UserService.service, {
    getById : UserService.getById,
    getAll  : UserService.getAll,
    addPhoto: UserService.addPhoto,
    saveAll : UserService.saveAll,
    save    : UserService.save,
    delete  : UserService.delete,
    edit    : UserService.edit,
});

server.bind(`0.0.0.0:${PORT}`, creds);

console.log(`Starting server on port ${PORT}`);

server.start();

