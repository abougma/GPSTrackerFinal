import net, { Socket } from "net";
import { encode, decode } from '../lib/cbor';
import Position from "../models/position";
import connectDB from "../db"; 

const IP = "127.0.0.1";
const PORT = 4567;

interface DecodedCborPayload {
    id?: any; 
    latitude?: number[];
    longitude?: number[];
    
}

const server = net.createServer((socket: Socket) => {
    console.log("Client connected");

    socket.on("data", async (data) => { 
        console.log("Données brutes reçues :", data);
        try {
            const parsed: DecodedCborPayload = decode(data) as DecodedCborPayload;
            console.log("CBOR décodé :", parsed);

            // Vérification plus robuste des champs nécessaires
            if (parsed && typeof parsed.id !== 'undefined' && Array.isArray(parsed.latitude) && parsed.latitude.length > 0 && Array.isArray(parsed.longitude) && parsed.longitude.length > 0) {
                console.log("ID brut reçu:", parsed.id);
                console.log("Tableau latitude brut:", parsed.latitude);
                console.log("Tableau longitude brut:", parsed.longitude);

                // Convertir les tableaux d'entiers en chaînes de caractères
                const latitudeString = String.fromCharCode(...parsed.latitude);
                const longitudeString = String.fromCharCode(...parsed.longitude);
                console.log("Latitude convertie en chaîne:", latitudeString);
                console.log("Longitude convertie en chaîne:", longitudeString);

                // Convertir les chaînes en nombres à virgule flottante
                const latitude = parseFloat(latitudeString);
                const longitude = parseFloat(longitudeString);
                console.log("Latitude décodée :", latitude);
                console.log("Longitude décodée :", longitude);

                // Vérifier si le parsing a produit des nombres valides
                if (isNaN(latitude) || isNaN(longitude)) {
                    console.error("Erreur: Latitude ou Longitude est NaN après parsing.", { latitudeString, longitudeString, latitude, longitude });
                    socket.write("Erreur: Données de coordonnées invalides après parsing.");
                    return; 
                }

                const positionData = {
                    deviceId: parsed.id,
                    latitude,
                    longitude,
                };
                console.log("Données préparées pour la sauvegarde :", positionData);

                const position = new Position(positionData);
                await position.save();
                console.log("Position sauvegardée en base de données:", position);
                socket.write("Données reçues, décodées et sauvegardées");
            } else {
                console.warn("Données CBOR décodées incomplètes, mal formées, ou champs essentiels manquants (id, latitude, longitude):", parsed);
                socket.write("Données reçues et décodées, mais structure incorrecte ou champs manquants pour sauvegarde.");
            }
        } catch (error) {
            console.error("Erreur lors du traitement des données ou de la sauvegarde :", error);
            console.log("Message brut :", data.toString('utf-8'));
            socket.write("Erreur lors du traitement des données");
        }
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (err: Error) => {
        console.error("Socket error:", err);
    });
});


async function startServer() {
    try {
        await connectDB(); 
        server.listen(PORT, IP, () => {
            console.log(`Server listening on ${IP}:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start TCP server due to DB connection error:", error);
        process.exit(1); 
    }
}

const test = { status: "ok", value: 42 };
const bin = encode(test);
console.log("CBOR:", bin);
const parsed = decode(bin as Uint8Array);
console.log("CBOR Decoded:", parsed);

startServer();
