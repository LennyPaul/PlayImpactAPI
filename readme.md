## Documentation de l'API

### Introduction
Cette API, construite avec Express et MongoDB, fournit des services pour l'enregistrement, l'authentification et la gestion des utilisateurs, y compris la gestion des points d'expérience et des points d'impact.

### Installation

1. **Cloner le dépôt**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Installer les dépendances**:
    ```sh
    npm install
    ```

3. **Configurer la base de données**:
    Remplacez `<your_connection_string>` dans `app.js` par votre chaîne de connexion MongoDB.

4. **Démarrer le serveur**:
    ```sh
    node app.js
    ```
    Le serveur s'exécute par défaut sur le port 3000.

### Points de terminaison

#### Enregistrement d'un utilisateur
- **URL**: `/register`
- **Méthode**: `POST`
- **Description**: Enregistre un nouvel utilisateur.
- **Corps de la requête**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Réponse**:
  - **201**: Utilisateur créé.
  - **400**: Erreur lors de la création de l'utilisateur.

#### Connexion d'un utilisateur
- **URL**: `/login`
- **Méthode**: `POST`
- **Description**: Connecte un utilisateur.
- **Corps de la requête**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Réponse**:
  - **200**: JSON avec le token JWT.
  - **400**: Utilisateur non trouvé ou mot de passe invalide.
  - **500**: Erreur lors de la connexion.

#### Changement de nom d'utilisateur
- **URL**: `/change-username`
- **Méthode**: `POST`
- **Description**: Change le nom d'utilisateur.
- **Autorisations**: Requiert un token JWT.
- **Corps de la requête**:
  ```json
  {
    "newUsername": "string"
  }
  ```
- **Réponse**:
  - **200**: Nom d'utilisateur mis à jour.
  - **400**: Nom d'utilisateur déjà pris ou utilisateur non trouvé.
  - **500**: Erreur lors de la mise à jour du nom d'utilisateur.

#### Ajouter de l'expérience
- **URL**: `/add-exp`
- **Méthode**: `POST`
- **Description**: Ajoute de l'expérience à l'utilisateur.
- **Autorisations**: Requiert un token JWT.
- **Corps de la requête**:
  ```json
  {
    "exp": "number"
  }
  ```
- **Réponse**:
  - **200**: Expérience ajoutée.
  - **400**: Utilisateur non trouvé.
  - **500**: Erreur lors de l'ajout de l'expérience.

#### Récupérer l'expérience de l'utilisateur
- **URL**: `/get-exp`
- **Méthode**: `GET`
- **Description**: Récupère l'expérience de l'utilisateur.
- **Autorisations**: Requiert un token JWT.
- **Réponse**:
  - **200**: JSON avec l'expérience.
  - **400**: Utilisateur non trouvé.
  - **500**: Erreur lors de la récupération de l'expérience.

#### Récupérer l'expérience de tous les utilisateurs
- **URL**: `/get-all-exp`
- **Méthode**: `GET`
- **Description**: Récupère l'expérience de tous les utilisateurs.
- **Autorisations**: Requiert un token JWT.
- **Réponse**:
  - **200**: JSON avec les utilisateurs et leur expérience.
  - **500**: Erreur lors de la récupération des utilisateurs.

#### Ajouter des points d'impact
- **URL**: `/add-impact-points`
- **Méthode**: `POST`
- **Description**: Ajoute des points d'impact à l'utilisateur.
- **Autorisations**: Requiert un token JWT.
- **Corps de la requête**:
  ```json
  {
    "points": "number"
  }
  ```
- **Réponse**:
  - **200**: Points d'impact ajoutés.
  - **400**: Utilisateur non trouvé.
  - **500**: Erreur lors de l'ajout des points d'impact.

#### Récupérer les points d'impact de l'utilisateur
- **URL**: `/get-impact-points`
- **Méthode**: `GET`
- **Description**: Récupère les points d'impact de l'utilisateur.
- **Autorisations**: Requiert un token JWT.
- **Réponse**:
  - **200**: JSON avec les points d'impact.
  - **400**: Utilisateur non trouvé.
  - **500**: Erreur lors de la récupération des points d'impact.

#### Récupérer les utilisateurs par expérience
- **URL**: `/users-by-exp`
- **Méthode**: `GET`
- **Description**: Récupère les utilisateurs triés par expérience.
- **Autorisations**: Requiert un token JWT.
- **Réponse**:
  - **200**: JSON avec les utilisateurs triés par expérience.
  - **500**: Erreur lors de la récupération des utilisateurs.

### Middleware

#### Vérification du token JWT
- **Fonction**: `authenticateToken`
- **Description**: Vérifie la présence et la validité du token JWT.
- **Utilisation**: Ajouté aux routes nécessitant une authentification.

### Conclusion

Cette API offre une solution robuste pour la gestion des utilisateurs avec des fonctionnalités d'enregistrement, de connexion, et de gestion des points d'expérience et d'impact, avec une sécurité assurée par JWT pour les opérations sensibles.