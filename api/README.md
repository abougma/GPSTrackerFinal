
# Protocole TCP en TypeScript

## Table des matières
1. [Introduction](#introduction)
2. [Caractéristiques principales](#caractéristiques-principales)
3. [Prérequis](#prérequis)
4. [Installation](#installation)
5. [Utilisation](#utilisation)
6. [Architecture](#architecture)
7. [Tests](#tests)
8. [Contributions](#contributions)
9. [Licence](#licence)
10. [ Serveur TCP](#serveur-tcp)

---

## Introduction

Ce projet implémente un **protocole TCP** en TypeScript. Il permet de démontrer les concepts de base des réseaux, notamment la communication entre un client et un serveur en utilisant des sockets.

L'objectif principal est de fournir une solution simple pour comprendre comment établir une connexion TCP en TypeScript, tout en respectant les bonnes pratiques modernes.

---

## Caractéristiques principales

- Établissement de connexions TCP entre un client et un serveur.
- Envoi et réception de données en temps réel.
- Gestion des erreurs et des déconnexions.
- Tests unitaires pour valider les fonctionnalités principales.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants :

- **Node.js** (version 16 ou plus recommandée)
- **TypeScript** (installé globalement ou dans le projet)
- Un gestionnaire de paquets comme **npm** ou **yarn**

---

## Installation

### Étapes pour configurer le projet

1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/JuniaXP-JS/armel.bougma.git
   cd armel.bougma
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```
   
3. Compilez le code TypeScript en JavaScript :
   ```bash
   npm run build
   ```

---

## Utilisation

### Lancer le serveur TCP

Pour démarrer le serveur TCP, exécutez la commande suivante :
```bash
npm run start-server
```

---

## Architecture

### Structure des fichiers
- **src/server.ts :** Code source du serveur TCP.
- **src/client.ts :** Code source du client TCP.
- **test/TCPserver.spec.ts :** Tests unitaires pour le serveur TCP.

### Fonctionnement général

1. Serveur :

- Écoute les connexions entrantes.
- Répond aux messages du client.
- Gère les erreurs et les déconnexions.
  
2. Client :

- Établit une connexion vers le serveur.
- Envoie des messages au format texte.
- Reçoit les réponses du serveur.

---

## Tests

Le projet inclut des tests unitaires pour vérifier le bon fonctionnement du protocole TCP.

### Lancer les tests

Pour exécuter les tests, utilisez la commande suivante:
```bash
npm run test
```

---

## Contributions

Les contributions sont les bienvenues ! Voici comment vous pouvez aider :

1. **Forkez** le dépôt.
2. **Créez une nouvelle branche** pour votre fonctionnalité :
   ```bash
   git checkout -b nouvelle-fonctionnalite
   ```
3. **Soumettez une Pull Request** avec une description claire.

---

## Licence
Ce projet est sous licence MIT. Consultez le fichier [Licence] pour plus d'informations.

---

## Serveur TCP

Ce projet met en œuvre un **serveur TCP** destiné à recevoir des messages depuis un objet connecté (IoT), comme un ESP32, un Raspberry Pi ou un autre microcontrôleur.  
L’objectif est de définir **le comportement attendu et le protocole utilisé**, sans se limiter à un langage spécifique.

---

### Protocole utilisé

- **Type de communication :** Protocole TCP (Transmission Control Protocol)
- **Mode :** Client / Serveur
- **Serveur :** En écoute sur un port fixe (ex : 3000)
- **Client :** L’objet connecté (IoT) agit en tant que client et initie la connexion
- **Format des messages :** Texte brut (`string`) ou JSON (`{"temperature":25.5}`), selon les besoins

---

### Comportement général

| Rôle        | Description |
|-------------|-------------|
| **Serveur** | Attend les connexions, reçoit les données, peut répondre, et gère les erreurs. |
| **Client IoT** | Se connecte, envoie un message, attend une réponse (optionnelle), et se déconnecte. |

---

### Schéma de fonctionnement

![Schéma de fonctionnement TCP IoT](/TCP.png)

- L’objet IoT se connecte à l’adresse IP du serveur et au port défini.
- Il envoie un message (ex. température, humidité, etc.).
- Le serveur peut enregistrer le message, afficher une réponse ou le traiter selon la logique métier.
- La connexion peut être fermée immédiatement après, ou maintenue selon le besoin.

---

### Étapes pour créer son propre serveur

Voici les **étapes conceptuelles** pour reproduire un serveur TCP, quel que soit le langage :

1. **Choisir un langage de programmation** (TypeScript, Python, Java, C#, etc.).
2. **Ouvrir un port TCP** sur la machine hôte (ex. : 3000).
3. **Accepter les connexions entrantes** (le serveur devient alors "récepteur").
4. **Lire les messages entrants** (données envoyées par l’IoT).
5. **Répondre (facultatif)** ou stocker les données.
6. **Gérer la déconnexion** (quand le client ferme la connexion).
7. **Traiter les erreurs** (déconnexions inopinées, messages vides, etc.).

---

### Avantages de cette approche

- **Langage-agnostique :** Le protocole est indépendant du langage utilisé.
- **Léger et rapide :** TCP est simple à mettre en œuvre sur la plupart des cartes IoT.
- **Fiable :** TCP garantit que les données arrivent dans l’ordre, sans perte.

---

### Exemple de test sans IoT

Avant de brancher un capteur réel, vous pouvez tester votre serveur TCP avec :

- **Netcat (nc)** : simulateur de client TCP.
- **Telnet**
- **Client TCP dans Postman** ou autre outil.

---

