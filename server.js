const http = require("http");
const WebSocket = require("ws");
const express = require("express");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("WebSocket connected");
  ws.on("message", function message(msg) {
    console.log("Received:", msg);
  });
});

app.use(express.static("public")); // or your frontend path

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
