var app = require("express")();
var https = require("https");
var fs = require("fs");

// Certificate
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/hugary.dev/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/hugary.dev/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/hugary.dev/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const httpsServer = https.createServer(credentials, app);

var io = require("socket.io")(httpsServer);
var port = process.env.PORT || 3000;

app.get("/chat", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
  });
});

httpsServer.listen(port, () => {
  console.log("HTTPS server running");
});
