import net from "net";

const TCP_HOST = "127.0.0.1";
const TCP_PORT = 4567;

export const sendToTCPServer = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        client.connect(TCP_PORT, TCP_HOST, () => {
            console.log("Connected to TCP server from utility");
            client.write(message);
        });

        client.on("data", (data: Buffer) => {
            console.log("Received from TCP server in utility:", data.toString());
            resolve(data.toString());
            client.destroy(); // Close connection after receiving data
        });

        client.on("error", (err: Error) => {
            console.error("Error with TCP connection in utility:", err);
            reject(err);
            client.destroy(); // Ensure client is destroyed on error
        });

        client.on("end", () => {
            console.log("Disconnected from TCP server in utility");
        });
    });
};