require('dotenv').config()
const { log } = require('console')
const { unlink, access } = require('fs/promises')
const { watch } = require('chokidar')
const { constants, readFileSync, writeFile, mkdir, write } = require('fs')
const { basename } = require('path')
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
    return {
        method: 'get',
        url: `${process.env.base}/${array[3]}/${array[4]}`,
        headers: {
            username: array[1],
            password: array[2],
            token: array[5],
        },
    }
}

//${config.cus_num}/${config.acc_num}
function getResponse(config, ext) {
    axios(config)
        .then(function (response) {
            writeToFile(JSON.stringify(response.data), ext)
        })
        .catch(function (error) {
            writeToFile(error, ext)
        })
}

function writeToFile(content, ext) {
    writeFile(`${process.env.OUTPUT_DIRECTORY}/${ext}`, content, (err) => {
        if (err) {
            log(err)
            return false
        }
        return true
    })
}

function fileClean(path) {
    try {
        unlink(path)
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

module.exports = { getResponse, buildConfig, fileOps }
