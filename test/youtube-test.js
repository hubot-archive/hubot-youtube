/* global describe, beforeEach, afterEach, it, context, require, process */
/* jshint esversion: 6 */

var Helper, chai, expect, helper, nock, sinon;
Helper = require('hubot-test-helper');
chai = require('chai');
sinon = require('sinon');
chai.use(require('sinon-chai'));
nock = require('nock');
helper = new Helper('./../src/youtube.js');
expect = chai.expect;

describe('youtube', () => {
  var room = null;

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz';
    room = helper.createRoom();
    nock.disableNetConnect();
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/youtube')(this.robot);
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    delete process.env.HUBOT_YOUTUBE_API_KEY;
    room.destroy();
    nock.cleanAll();
  });

  context('retrieves a random video', () => {
    beforeEach(function(done) {
      nock('https://www.googleapis.com')
      .get('/youtube/v3/search')
      .query({
        order: 'relevance',
        part: 'snippet',
        type: 'video',
        maxResults: 15,
        q: 'star wars',
        key: 'foobarbaz'
      })
      .replyWithFile(200, __dirname +'/fixtures/search-random.json');
      room.user.say('alice', 'hubot yt star wars');
      return setTimeout(done, 100);
    });

    return it('should respond with a random video', function() {
      return expect(room.messages[1][1]).to.match(/^https:\/\/www\.youtube\.com\/watch\?v\=[a-zA-Z0-9_\-]{11}$/i);
    });
  });

  context('ignores messages without being addressed', () => {
    beforeEach(function(done) {
      room.user.say('alice', 'yt star wars');
      return setTimeout(done, 100);
    });

    return it('should not respond', function() {
      return expect(room.messages.length).to.equal(1);
    });
  });
});


describe('youtube hear', () => {
  var room = null;

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz';
    process.env.HUBOT_YOUTUBE_HEAR = 'true';
    room = helper.createRoom();
    nock.disableNetConnect();
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/youtube')(this.robot);
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    delete process.env.HUBOT_YOUTUBE_API_KEY;
    delete process.env.HUBOT_YOUTUBE_HEAR;
    room.destroy();
    nock.cleanAll();
  });

  context('retrieves a random video', () => {
    beforeEach(function(done) {
      nock('https://www.googleapis.com')
      .get('/youtube/v3/search')
      .query({
        order: 'relevance',
        part: 'snippet',
        type: 'video',
        maxResults: 15,
        q: 'star wars',
        key: 'foobarbaz'
      })
      .replyWithFile(200, __dirname +'/fixtures/search-random.json');
      room.user.say('alice', 'yt star wars');
      return setTimeout(done, 100);
    });

    return it('should respond with a random video', function() {
      return expect(room.messages[1][1]).to.match(/^https:\/\/www\.youtube\.com\/watch\?v\=[a-zA-Z0-9_\-]{11}$/i);
    });
  });

  context('ignores messages when directly addressed', () => {
    beforeEach(function(done) {
      room.user.say('alice', 'hubot yt star wars');
      return setTimeout(done, 100);
    });

    return it('should not respond', function() {
      return expect(room.messages.length).to.equal(1);
    });
  });
});

describe('youtube deterministic', () => {
  var room = null;

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz';
    process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS = 'true';
    room = helper.createRoom();
    nock.disableNetConnect();
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/youtube')(this.robot);
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    delete process.env.HUBOT_YOUTUBE_API_KEY;
    delete process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS;
    room.destroy();
    nock.cleanAll();
  });

  context('retrieves top video', () => {
    beforeEach(function(done) {
      nock('https://www.googleapis.com')
      .get('/youtube/v3/search')
      .query({
        order: 'relevance',
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        q: 'star wars',
        key: 'foobarbaz'
      })
      .replyWithFile(200, __dirname +'/fixtures/search-single.json');
      room.user.say('alice', 'hubot yt star wars');
      return setTimeout(done, 100);
    });

    return it('should respond with top video', function() {
      return expect(room.messages[1][1]).to.equal('https://www.youtube.com/watch?v=bL_PDgczHJc');
    });
  });
});

describe('youtube video title', () => {
  var room = null;

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz';
    process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS = 'true';
    process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE = 'true';
    room = helper.createRoom();
    nock.disableNetConnect();
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/youtube')(this.robot);
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    delete process.env.HUBOT_YOUTUBE_API_KEY;
    delete process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS;
    delete process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE;
    room.destroy();
    nock.cleanAll();
  });

  context('retrieves top video with title', () => {
    beforeEach(function(done) {
      nock('https://www.googleapis.com')
      .get('/youtube/v3/search')
      .query({
        order: 'relevance',
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        q: 'star wars',
        key: 'foobarbaz'
      })
      .replyWithFile(200, __dirname +'/fixtures/search-single.json');
      room.user.say('alice', 'hubot yt star wars');
      return setTimeout(done, 100);
    });

    return it('should respond with top video with title', function() {
      return expect(room.messages[1][1]).to.equal('Why Hayden Christensen Played Anakin PERFECTLY &#45; Star Wars Explained - https://www.youtube.com/watch?v=bL_PDgczHJc');
    });
  });
});

describe('youtube video title with decoded HTML', () => {
  var room = null;

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz';
    process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS = 'true';
    process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE = 'true';
    process.env.HUBOT_YOUTUBE_DECODE_HTML = 'true';
    room = helper.createRoom();
    nock.disableNetConnect();
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/youtube')(this.robot);
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    delete process.env.HUBOT_YOUTUBE_API_KEY;
    delete process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS;
    delete process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE;
    delete process.env.HUBOT_YOUTUBE_DECODE_HTML;
    room.destroy();
    nock.cleanAll();
  });

  context('retrieves top video with decoded title', () => {
    beforeEach(function(done) {
      nock('https://www.googleapis.com')
      .get('/youtube/v3/search')
      .query({
        order: 'relevance',
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        q: 'star wars',
        key: 'foobarbaz'
      })
      .replyWithFile(200, __dirname +'/fixtures/search-single.json');
      room.user.say('alice', 'hubot yt star wars');
      return setTimeout(done, 100);
    });

    return it('should respond with top video with decoded title', function() {
      return expect(room.messages[1][1]).to.equal('Why Hayden Christensen Played Anakin PERFECTLY - Star Wars Explained - https://www.youtube.com/watch?v=bL_PDgczHJc');
    });
  });
});

describe('youtube missing configuration', () => {
  var room = null;

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error';
    room = helper.createRoom();
    nock.disableNetConnect();
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/youtube')(this.robot);
  });

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL;
    room.destroy();
    nock.cleanAll();
  });

  context('retrieves top video with decoded title', () => {
    beforeEach(function(done) {
      room.user.say('alice', 'hubot yt star wars');
      return setTimeout(done, 100);
    });

    return it('should respond with error message', function() {
      return expect(room.messages[1][1]).to.equal('You must configure the HUBOT_YOUTUBE_API_KEY environment variable');
    });
  });
});
