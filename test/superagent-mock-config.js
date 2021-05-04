var response = require('./response.js')
module.exports = [
    {
        pattern: `https://payments.bel.com.bz:443/WebServiceTest/OnlineBank/Saldos/V1/12345/12345`,
        fixtures: function (match, headers) {
            return response
        },

        get: function (match, data) {
            return {
                body: data,
            }
        },
    },
]
