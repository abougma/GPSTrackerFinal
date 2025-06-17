
# Projet GPS Tracker

Ce projet est une application de suivi GPS composée d'une API backend et d'une application mobile Expo. Il utilise Docker et Docker Compose pour faciliter le lancement des différents services.

## Prérequis

* Docker Desktop installé et en cours d'exécution.
* Expo Go installé sur un appareil mobile (Android ou iOS) ou un émulateur.
* L'appareil mobile/émulateur doit être sur le même réseau que l'ordinateur exécutant Docker.
* Une connexion Internet active (pour le tunnel Expo).

## Instructions de lancement

1. **Cloner le dépôt du projet.**

2. **Configurer l'adresse IP de l'API pour l'application mobile :**

    * Ouvrez le fichier `mobile/config/apiConfig.ts`.
    * Identifiez l'adresse IP de votre machine sur votre réseau local (celle accessible par votre appareil mobile).
        * Sur Windows : ouvrez CMD et tapez `ipconfig` (cherchez l'adresse IPv4 de votre adaptateur Wi-Fi ou Ethernet actif).
        * Sur macOS/Linux : ouvrez un terminal et tapez `ifconfig` ou `ip addr` (cherchez l'adresse IP de votre interface réseau active).
    * Dans `mobile/config/apiConfig.ts`, remplacez l'adresse IP actuelle (par exemple, `172.20.10.4`) par **votre adresse IP locale** :

    ```typescript
    // Exemple : si votre IP locale est 192.168.1.100
    const API_BASE_URL = "http://192.168.1.100:3000/api"; 

    export default API_BASE_URL;
    ```

    * **Important :** Cette étape est cruciale pour que l'application mobile puisse communiquer avec l'API.

3. **Démarrer les services avec Docker Compose :**

    * Ouvrez un terminal à la racine du projet.
    * Exécutez la commande suivante :

    ```bash
    docker-compose up --build
    ```

    * Le `--build` est important, surtout après avoir modifié `apiConfig.ts` ou si c'est le premier lancement.
    * Attendez que tous les services démarrent. Vous devriez voir des logs pour `api_service`, `mobile_service`, et `mongo_db`.
        * `api_service` devrait afficher un message comme "HTTP server running on http://localhost:3000".
        * `mobile_service` devrait afficher un QR code.

4. **Lancer l'application mobile :**

    * Ouvrez l'application Expo Go sur votre appareil mobile.
    * Scannez le QR code affiché dans les logs du `mobile_service`.
    * L'application devrait se charger.

## Tester l'API (Optionnel)

L'API est accessible directement depuis votre machine via un navigateur ou un outil comme Postman à l'adresse `http://localhost:3000`. Par exemple, si vous avez une route `/api/users`, elle sera accessible à `http://localhost:3000/api/users`.

---

# Mode Simulation — Gestion manuelle des positions GPS

Pour permettre au professeur ou à toute personne sans capteur connecté de simuler et visualiser des positions GPS, un mode manuel est disponible via l’API.

## 1. Ajouter une position GPS

Envoyez une requête `POST` à l’endpoint suivant pour créer une nouvelle position :

```
POST http://<adresse-ip-api>:3000/api/positions
Content-Type: application/json
```

Exemple de corps JSON :

```json
{
  "latitude": 5.34567,
  "longitude": -4.01234,
  "deviceId": 123
}
```

> Remplacez `<adresse-ip-api>` par l’adresse IP configurée dans `mobile/config/apiConfig.ts`.  
> Le champ `timestamp` est optionnel (si non fourni, le serveur prendra la date/heure actuelle).

---

## 2. Récupérer toutes les positions

Requête `GET` pour lister toutes les positions simulées :

```
GET http://<adresse-ip-api>:3000/api/positions
```

---

## 3. Modifier une position

Requête `PUT` pour modifier une position existante (exemple avec ID `123`) :

```
PUT http://<adresse-ip-api>:3000/api/positions/123
Content-Type: application/json
```

Corps JSON :

```json
{
  "latitude": 5.12345,
  "longitude": -4.54321,
  "description": "Position mise à jour"
}
```

---

## 4. Supprimer une position

Requête `DELETE` pour supprimer une position (exemple avec ID `123`) :

```
DELETE http://<adresse-ip-api>:3000/api/positions/123
```

---

## Exemple avec curl (terminal)

Ajouter une position GPS :

```bash
curl -X POST http://<adresse-ip-api>:3000/api/positions \
 -H "Content-Type: application/json" \
 -d '{"latitude":5.34567,"longitude":-4.01234,"timestamp":"2025-06-17T10:30:00Z","description":"Position test"}'
```

---

# Structure du projet

* `/api` : Contient le code source du backend (Node.js/Express).
* `/mobile` : Contient le code source de l'application mobile (React Native/Expo).
* `docker-compose.yml` : Définit et orchestre les services Docker.
* `api/Dockerfile` : Instructions pour construire l'image Docker de l'API.
* `mobile/Dockerfile` : Instructions pour construire l'image Docker de l'application mobile.

---

# Points d'attention

* **Pare-feu** : Assurez-vous que votre pare-feu autorise les connexions entrantes sur le port `3000` (pour l'API) et `8081` (pour Metro Bundler si besoin de connexion directe) afin que l'appareil mobile puisse communiquer avec les services.
* **Réseau** : L'ordinateur exécutant Docker et l'appareil mobile avec Expo Go doivent impérativement être sur le même réseau local.
* **Connexion Internet** : Une connexion Internet est requise pour que le tunnel Expo (`--tunnel`) fonctionne, permettant à Expo Go de télécharger le bundle de l'application.
