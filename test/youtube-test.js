var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

var expect = chai.expect;

describe('youtube', function() {
    beforeEach(function() {
        this.robot = {
            respond: sinon.spy(),
            hear: sinon.spy(),
        };    
        require('../src/youtube')(this.robot);
    });

    it('registers a respond listener', function() {
        expect(this.robot.respond).to.have.been.calledWith(/(?:youtube|yt)(?: me)? (.*)/i);
    });
});