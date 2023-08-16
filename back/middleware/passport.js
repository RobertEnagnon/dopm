const passport = require('passport');
const { MultiSamlStrategy } = require('passport-saml');
const controller = require('../controllers/ad.controller');
const config = require('../config/config')

/* Configuration à partir des informations présents dans 
* https://www.npmjs.com/package/passport-saml
* https://github.com/node-saml/passport-saml/blob/HEAD/docs/adfs/README.md
*/

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user)
    done(null, user);
});

const fetchSamlConfig = async (request, done) => {

    const connections = await controller.getConnection();
    if (connections.length > 0) {
        const connection = connections[0];
        return done(null, {
            entryPoint: connection.login_url,
            issuer: config.CALLBACK_URL,
            callbackUrl: config.CALLBACK_URL,
            cert: connection.certificat,
            logoutUrl: connection.logout_url,
            logoutCallbackUrl: config.LOGOUT_CALLBACK_URL,
        })
    }
    return done(null)
};

// saml strategy for passport
const strategy = new MultiSamlStrategy(
    {
        passReqToCallback: true, // makes req available in callback
        identifierFormat: null,
        audience: config.CALLBACK_URL,
        getSamlOptions(request, done) {
            fetchSamlConfig(request, done);
        },
    },
    (req, profile, done) => { // Construction de la variable user qui sera présente dans chaque requête avec req.user
        console.log("CONSTRUCTION DU PROFIL")
        console.log(profile)
        let user = {};
        user.nameID = profile.nameID;
        user.nameIDFormat = profile.nameIDFormat || "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
        user.email = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        user.last_name = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
        user.first_name = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        done(null, user);
    },

);

passport.use(strategy);

module.exports = { passport, strategy };