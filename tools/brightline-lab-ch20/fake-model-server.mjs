// A stand-in model API for the authors' simulation: serves recorded responses in order.
// usage: node fake-model-server.mjs <port> <fixture.json>
import http from "node:http"; import { readFileSync } from "node:fs";
const [port, file] = process.argv.slice(2); const queue = JSON.parse(readFileSync(file, "utf8"));
http.createServer((req, res) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => {
  res.writeHead(200, { "content-type": "application/json", "request-id": `req_sim_${queue.length}` });
  res.end(JSON.stringify(queue.shift())); }); }).listen(port, "127.0.0.1");
