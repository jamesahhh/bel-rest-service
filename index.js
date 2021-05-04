const { log } = require('console')
const { readFileSync } = require('fs')
const { basename } = require('path')
const request = require('superagent')

let funcs = {}

function fileOps(path) {
    var array = readFileSync(path).toString().split(/\r?\n/)
    var ext = basename(path)
    //TODO: api connect
    //removeFile(path)
    return array
}

function buildConfig(array) {
    return {
        method: array[0],
        username: array[1],
        password: array[2],
        cus_num: array[3],
        acc_num: array[4],
        token: array[5],
    }
}

//${config.cus_num}/${config.acc_num}
function getResponse(config) {
    return request
        .get(
            `https://payments.bel.com.bz:443/WebServiceTest/OnlineBank/Saldos/V1/${config.cus_num}/${config.acc_num}`
        )
        .timeout({
            response: 5000, // Wait 5 seconds for the server to start sending,
            deadline: 60000, // but allow 1 minute for the file to finish loading.
        })
        .then((res) => {
            return res.body ? res.body : err.body
        })
        .catch(console.error)
}

module.exports = { getResponse, buildConfig, fileOps }
