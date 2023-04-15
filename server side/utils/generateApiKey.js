const crypto = require('crypto');

function generateApiKey(email) {
    const timestamp = Date.now().toString();
    const data = email + timestamp;
    const apiKey = crypto.createHash('sha256').update(data).digest('hex');
    return apiKey;
}

module.exports = { generateApiKey }