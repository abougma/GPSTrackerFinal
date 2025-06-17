# GPSTrackerApp - Projet Mobile avec Expo et Docker

Ce projet utilise Docker pour faciliter la configuration de l'environnement de développement.

## Prérequis

*   [Git](https://git-scm.com/downloads)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) 

## Instructions pour lancer le projet avec Docker

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/abougma/GPSTrackerMobile.git
    cd GPSTrackerApp
    ```

2.  **Construire l'image Docker :**
    À la racine du projet cloné (où se trouve le `Dockerfile`), exécutez :
    ```bash
    docker build -t gps-tracker-app .
    ```
    *(Cela peut prendre quelques minutes la première fois, car Docker télécharge l'image de base Node.js et installe les dépendances.)*

3.  **Lancer le conteneur Docker :**
    ```bash
    docker run -p 19000:19000 -p 19001:19001 -p 19002:19002 --rm --name gps-tracker-container gps-tracker-app
    ```
    *   `-p 19000:19000 -p 19001:19001 -p 19002:19002` : Mappe les ports nécessaires d'Expo du conteneur vers votre machine hôte.
    *   `--rm` : Supprime automatiquement le conteneur lorsqu'il est arrêté.
    *   `--name gps-tracker-container` : Donne un nom au conteneur pour une gestion plus facile (optionnel).
    *   `gps-tracker-app` : Le nom que nous avons donné à l'image à l'étape `docker build`.

4.  **Accéder à l'application :**
    *   Une fois le conteneur lancé, le serveur de développement Expo démarrera.
    *   Dans les logs du terminal où vous avez lancé `docker run`, vous verrez apparaître un **code QR** et une URL de type `exp://u.expo.dev/...` (grâce à l'option `--tunnel`).
    *   Ouvrez l'application **Expo Go** sur votre téléphone ou un émulateur/simulateur.
    *   Scannez le code QR ou entrez manuellement l'URL du tunnel pour charger l'application.

## Configuration de l'API (Important)

Si l'application se connecte à une API backend :
*   Assurez-vous que la variable `API_BASE_URL` dans `src/config/apiConfig.js` (ou l'équivalent dans votre projet) pointe vers une adresse accessible depuis l'environnement Docker.
*   Si l'API tourne localement sur la machine de votre professeur (en dehors de Docker), il/elle devra utiliser `host.docker.internal` (pour Docker Desktop sur Windows/Mac) ou l'adresse IP de sa machine sur le réseau local à la place de `localhost` ou `127.0.0.1`. Par exemple : `http://host.docker.internal:PORT_API`.
*   Si l'API est déployée publiquement, utilisez son URL publique.

## Arrêter le conteneur

Pour arrêter le serveur de développement et le conteneur, allez dans le terminal où `docker run` est en cours d'exécution et appuyez sur `Ctrl+C`. Le conteneur sera automatiquement supprimé grâce à l'option `--rm`.
Si vous n'avez pas utilisé `--rm` ou si le terminal a été fermé, vous pouvez l'arrêter avec :
```bash
docker stop gps-tracker-container
docker rm gps-tracker-container # Si --rm n'a pas été utilisé
