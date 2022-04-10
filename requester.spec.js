const chai = require('chai')

const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const app = require('./server')

let requester = chai.request(app).keepOpen()
module.exports = requester

after(function() {
    requester.close()
})