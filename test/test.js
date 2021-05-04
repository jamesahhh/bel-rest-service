var assert = require('assert')
var { expect } = require('chai')
var main = require('../index.js')
var request = require('superagent')
var config = require('./superagent-mock-config')
const superagentMock = require('superagent-mock')

describe('Configuration from File', function () {
    let array
    before(function () {
        array = main.fileOps('./test/test.txt')
    })
    it('should return array with length 6 after reading', function () {
        assert(array.length, 6)
    })
    it('should return JS Object with fields assigned', function () {
        expect(main.buildConfig(array).method).to.equal('GetAccount')
    })
})

describe('Get Account Tests', function () {
    let superagentMock, testConfig

    before(() => {
        superagentMock = require('superagent-mock')(request, config)
        let array = main.fileOps('./test/test.txt')
        testConfig = main.buildConfig(array)
    })

    after(() => {
        superagentMock.unset()
    })
    it('should return something', function () {
        var result = main.getResponse(testConfig)
        return result.then((data) => {
            expect(data.Status).to.equal('200')
        })
    })
})
