const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key'];
        if (!token) {
            return res.status(401).send('please input token!!')
        };

        let key = process.env.USER_SECRET_KEY;

        let decodeToken = jwt.verify(token, key);

        req.loggedInUser = decodeToken;
        next()

    } catch (e) {
        if (e.message === 'invalid token') {
            return res.status(400).send('invalid token!!');
        } else {
            return res.status(500).send(e.message);
        };
    };
};

module.exports = authentication;