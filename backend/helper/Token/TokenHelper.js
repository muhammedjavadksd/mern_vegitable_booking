
let jwt = require("jsonwebtoken");


let tokenHelper = {

    TokenGenerator: async function (data) {
        try {
            let token = await jwt.sign({...data}, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' });
            return token;
        } catch (e) {
            console.log(data)
            return false;
        }
    }
}

module.exports = tokenHelper