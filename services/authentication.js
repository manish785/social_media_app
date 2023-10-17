const JWT = require('jsonwebtoken');

const secret = 'Manish@9876';

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