# Prerequisite
1.  NodeJs
2.  WampServer

# Dossier à créer

/public/images
/public/images/asFile
/public/images/audit
/public/images/audit-map
/public/images/suggestion
/public/images/fichesecurite
/public/images/ficheinfirmerie
/public/images/profil
/public/files


# Clone 

```bash
git clone https://gitlab.com/dopm/dopm-back
```

# Run


```bash
npm install
```

```bash
node server.js
```

# Re-generate database


```bash
npx prisma db push --preview-feature --accept-data-loss 
```

# SSO

## Configuration nécessaire dans l'AD

URL de réponse pour le connexion : **https://{nom de domaine api-dopm}/api/auth/login/sso/callback**

URL de réponse pour le déconnexion : **https://{nom de domaine api-dopm}/api/auth/logout/sso/callback**

Champs nécessaires lors de la réponse SAML :
 * nameID
 * email
 * nom
 * prénom

## Confiuration nécessaire dans l'application

Aller dans l'onglet Administration puis dans AD afin de rentrer :
 * l'URL de connexion de l'AD
 * l'URL de déconnexion de l'AD
 * le certificat pour l'application
 
## Fonctionnnement SSO

Lorsqu'une connexion AD est définie dans l'application, chaque nouvelle connexion sur la page /Auth/SignIn renverra directement vers le back (/api/auth/login/sso) qui demandera à l'AD si l'utilisateur est authentifié ou pas 

 * Si l'utilisateur est authentifié alors l'AD renvoie vers le back (/api/auth/logout/sso/callback) 
 * Sinon l'AD va afficher la page de connexion pour que l'utilisateur rentre son login / mdp puis une fois l'utilisateur authentifié, l'AD renvoie vers le back (/api/auth/logout/sso/callback) 

Lorsque l'utilisateur est authentifié, soit l'utilsateur existe dans la base dans ce cas il y a un update des champs email / nom / prenom de l'utilisateur pour correspondre aux données de l'AD.

Soit l'utilisateur n'existe pas et dans ce cas il est créé avec email / nom / prenom venant de l'AD ainsi qu'un role user.

Par la suite, le back renvoie vers la page /Auth/SignIn avec en paramètre le token identifiant l'utilisateur puis le front fait appel au back pour avoir le reste des informations (nom/prénom/permissions ...). 

Toutes les infos sont stockées dans le localStorage puis il y a un renvoi vers la page (/dashboard)

