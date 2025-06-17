import { Socket } from "node:net";

const IP = "127.0.0.1";
const PORT = 4567;

const client = new Socket();

client.connect(PORT, IP, () => {
    console.log("Client connected");
    client.write("Hello from client");
});

client.on("data", (data) => {
    console.log("Received:", data.toString());
});

client.on("end", () => {
    console.log("Connection ended by server");
});

client.on("close", () => {
    console.log("Client disconnected");
});

client.on("error", (err) => {
    console.error("Socket error:", err);
});
