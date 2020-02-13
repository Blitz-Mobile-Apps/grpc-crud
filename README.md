# Grpc CRUD Sample

This is sample crud application for demonstration and you are free to clone and use it as per your need. 

### Prerequisites
* **Node**
* **npm**

### Install and run it locally
Clone this repo to your local machine

```bash
git clone https://github.com/JamieDove/grpc-crud.git
```

Install the dependencies

```bash
npm install
```

Firstly you will need to generate certs for your system and project. and you can run this command.

```bash
npm run gen:
```

### Run Grpc Server
```bash
npm run server
```

now run client with params from 1 to 7

```bash
node client 1
node client 2
node client 3
node client 4
node client 5
node client 6
node client 7
```
