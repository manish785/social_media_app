const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET;


function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = JWT.sign(payload, secret, { expiresIn: '1000000' });
    return token;
}


function validateToken(token) {
    const payload = JWT.verify(token, secret);
    console.log('payload', payload);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};