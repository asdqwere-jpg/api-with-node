let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
require(`dotenv`).config();
chai.use(chaiHttp);

describe('Test Send Message Route', () => {
    it('Succeed', (done) => {
        chai.request(server)
            .post('/email/send')
            .end((err, res) => {
                done();
            });
    });
});