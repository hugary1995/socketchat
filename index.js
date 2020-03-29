var fs = require("fs");
var https = require("https");
var express = require("express");

var app = express();

// Certificate
var privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/hugary.dev/privkey.pem",
  "utf8"
);
var certificate = fs.readFileSync(
  "/etc/letsencrypt/live/hugary.dev/cert.pem",
  "utf8"
);
var ca = fs.readFileSync("/etc/letsencrypt/live/hugary.dev/chain.pem", "utf8");

var credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

var serverPort = 3000;

var server = https.createServer(credentials, app);
var io = require("socket.io")(server);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
  });
});

server.listen(port, () => {
  console.log("HTTPS server running");
});
