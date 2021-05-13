require('dotenv').config()
const { log } = require('console')
const { unlink, access } = require('fs/promises')
const { watch } = require('chokidar')
const { constants, readFileSync, writeFile, mkdir } = require('fs')
const { basename } = require('path')
const moment = require('moment')
var axios = require('axios')

checkFor(process.env.WATCH_DIRECTORY)
checkFor(process.env.OUTPUT_DIRECTORY)

var watcher = watch(process.env.WATCH_DIRECTORY, {
    awaitWriteFinish: {
        stabilityThreshold: 1500,
        pollInterval: 100,
    },
    ignored: /^(?=.*(\.\w+)$)(?!.*(\.txt)$).*$/,
})

watcher.on('add', (path) => {
    var obj = fileOps(path)
    var configObj = buildConfig(obj.array)
    getResponse(configObj, obj.ext)
    fileClean(path)
})

function fileOps(path) {
    let out = {}
    out.array = readFileSync(path).toString().split(/\r?\n/)
    out.ext = basename(path)
    return out
}

function buildConfig(array) {
    var now, time, inData
    if (array[0] == 'SetPayment') {
        now = moment().format('DD-MMM-yyyy').toUpperCase()
        time = moment().format('H:mm:ss')
        inData = {
            AccountNumber: array[5],
            CustomerNumber: array[4],
            Amountpaid: array[6],
            PaymentDate: now,
            PaymentTime: time,
            ReceiptNumber: array[7],
            TransactionType: array[8],
            PaymentStatus: array[9],
        }
    }
    return array[0] == 'GetAccount'
        ? {
              method: 'get',
              url: `${process.env.baseGET}/${array[3]}/${array[4]}`,
              headers: {
                  username: array[1],
                  password: array[2],
                  token: array[5],
              },
          }
        : {
              method: 'post',
              url: `${process.env.basePOST}`,
              headers: {
                  username: array[1],
                  password: array[2],
                  token: array[3],
                  'Content-Type': 'application/json',
              },
              data: inData,
          }
}

//${config.cus_num}/${config.acc_num}
function getResponse(config, ext) {
    axios(config)
        .then(function (response) {
            writeToFile(JSON.stringify(response.data), ext)
        })
        .catch(function (error) {
            writeToFile(JSON.stringify(error.response.data), ext)
        })
}

function writeToFile(content, ext) {
    writeFile(`${process.env.OUTPUT_DIRECTORY}/${ext}`, content, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

async function fileClean(path) {
    try {
        await unlink(path)
    } catch (error) {
        log(error.message)
    }
}

function checkFor(path) {
    try {
        access(path, constants.R_OK | constants.W_OK)
    } catch (err) {
        createDirectory(path)
    }
}

function createDirectory(path) {
    mkdir(path, { recursive: true }, function (err) {
        if (err) log(err)
        else log(`Directory created at ${path}`)
    })
}

module.exports = {}
