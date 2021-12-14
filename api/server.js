const express = require("express");

const server = express();

server.use(express.json());

server.all("/", (req, res) => res.send("Server is live"));

module.exports = server;
