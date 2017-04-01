var boot = require('../app.js').boot,
    shutdown = require('../app.js').shutdown,
    port = require('../app.js').port,
    superagent = require('superagent'),
    expect = require('chai').expect;

describe('server', function () {
    before(function () {
        boot();
    });

    describe('homepage', function () {
        it('should respond to GET', function (done) {
            superagent.get('http://localhost:' + port)
                .end(function (res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });

    after(function () {
        shutdown();
    });
});
