const controller = require("../controllers/ad.controller");

const { authJwt, passport } = require("../middleware");
const controllerUser = require("../controllers/user.controller");
const config = require('../config/config');
const { strategy } = require('../middleware/passport')

module.exports = function (app) {

    app.get('/api/auth/login/sso',
        passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
        function (req, res) {
            res.redirect(config.ERROR_REDIRECT_URL);
        }
    );

    app.post('/api/auth/login/sso/callback',
        passport.authenticate('saml', { failureRedirect: "/", failureFlash: true }),
        async (req, res) => {
            console.log("LOG USER SERIALIZE")
            console.log(req.user)

            const email = req.user.email;
            const last_name = req.user.last_name;
            const first_name = req.user.first_name;

            console.log("email : " + email);
            console.log("last_name : " + last_name);
            console.log("first_name : " + first_name);

            if (email && last_name && first_name) {
                const existing_user = await controller.verifyExistence(email);
                let token = "";
                if (existing_user == null) {  // insertion d'un utilisateur avec des valeurs par défaut
                    const new_user = await controllerUser.createUser({
                        last_name: last_name,
                        first_name: first_name,
                        fonction: "",
                        createdAt: new Date(),
                        username: email,
                        email: email,
                        password: Math.random().toString(36).slice(-8), // random password plutôt faible
                        roles: "user",
                        language: "french"
                    });
                    token = controller.generateToken(new_user.user.id);
                } else { // update pour correspondre aux infos de l'AD

                    const user = await controller.getUserInformations(existing_user.id);
                    await controllerUser.updateUser(user.id, {
                        last_name: last_name,
                        first_name: first_name,
                        fonction: user.fonction,
                        createdAt: user.createdAt,
                        username: user.username,
                        email: user.email,
                        password: user.password,
                        roles: user.role[0].role.name,
                        language: user.language[0].language.name,
                    })
                    token = controller.generateToken(user.id);
                }

                res.redirect(config.LOGIN_REDIRECT_URL + '?token=' + token);
            } else {
                let error = ""
                if (!email)
                    error = "Email non récupéré"
                else if (!last_name)
                    error = "Nom non récupéré"
                else if (!first_name)
                    error = "Prénom non récupéré"

                res.redirect(encodeURI(config.ERROR_REDIRECT_URL + '?error=' + error));
            }

        }
    );

    app.get('/api/auth/logout/sso', async (req, res) => {

        if (req.user == null) {
            return res.redirect(encodeURI(config.ERROR_REDIRECT_URL + '?error=Utilisateur inconnu'));
        }

        return strategy.logout(req, function (err, uri) {
            if (err) { console.log("ERROR LOGOUT"); console.log(err); return err; }
            else {
                return res.redirect(uri);
            }
        });
    });

    app.post('/api/auth/logout/sso/callback', (req, res) => {
        console.log("POST CALLBACK SAML LOGOUT")
        req.logout(function (err) {
            if (err) { console.log("ERROR CALLBACK LOGOUT"); console.log(err); return next(err); }
            res.clearCookie('connect.sid');
            res.redirect(config.LOGOUT_REDIRECT_URL);
        });
    });

    app.get('/api/ad/enable', async (req, res, next) => {
        try {
            const connections = await controller.getEnableConnection();
            res.status(200).json(connections.length > 0)
        } catch (err) {
            res.status(400).json({
                error: "Get Connection : " + err
            });
        }

    })

    app.get('/api/ad/metadata', async (req, res, next) => {
        try {
            res.type('application/xml');
            strategy.generateServiceProviderMetadata(req, null, null, (err, data) => {
                if (err) { console.log(err); return err }
                res.status(200).send(data)
            });
        } catch (err) {
            res.status(400).json({
                error: "AD Metadata : " + err
            });
        }

    })

    app.get('/api/ad', authJwt.verifyToken, async (req, res, next) => {
        try {
            const connections = await controller.getConnection();
            res.status(200).json(connections)
        } catch (err) {
            res.status(400).json({
                error: "Get Connection : " + err
            });
        }
    })

    app.get('/api/ad/informations', authJwt.verifyToken, async (req, res) => {

        const id = req.userId;
        console.log("userId from token : " + id);
        let user = await controller.getUserInformations(id);
        const permissions = await controller.handlePermissions(id);
        const token = controller.generateToken(id);

        res.status(200).json({
            id: user.id,
            lastname: user.last_name,
            firstname: user.first_name,
            birthdate: user.birthdate,
            email: user.email,
            function: user.fonction,
            username: user.username,
            password: user.password,
            roles: user.role[0].role.name,
            language: user.language[0].language.name,
            accessToken: token,
            createdAt: user.createdAt,
            url: user.url,
            permissions: permissions
        });
    })
    app.post('/api/ad', authJwt.verifyToken, controller.createConnection)
    app.put('/api/ad/:id', authJwt.verifyToken, controller.modifyConnection)
    app.delete('/api/ad/:id', authJwt.verifyToken, controller.deleteConnection)

}