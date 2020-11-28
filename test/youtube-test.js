'use strict'

/* global describe, beforeEach, afterEach, it */

const path = require('path')

const chai = require('chai')
const Hubot = require('hubot')
const nock = require('nock')

const expect = chai.expect
const Robot = Hubot.Robot
const TextMessage = Hubot.TextMessage

chai.use(require('sinon-chai'))

describe('require("youtube")', () => {
  it('exports a function', () => {
    expect(require('../index')).to.be.a('Function')
  })
})

describe('youtube', () => {
  let robot, user

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error'
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz'
    nock.disableNetConnect()
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'youtube.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'alice',
        real_name: 'Alice Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('alice')
  })

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL
    delete process.env.HUBOT_YOUTUBE_API_KEY
    nock.cleanAll()
    nock.enableNetConnect()
    robot.shutdown()
  })

  it('retrieves a random video', (done) => {
    // Set up the success conditions
    robot.adapter.on('send', function (envelope, strings) {
      expect(strings[0]).to.match(/^https:\/\/www\.youtube\.com\/watch\?v=(.*)/i)
      done()
    })

    // Mock the API response
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
    .replyWithFile(200, path.resolve(__dirname, 'fixtures', 'search-random.json'))

    // Run the test
    robot.adapter.receive(new TextMessage(user, 'hubot yt star wars'))
  })
})

describe('youtube hear', () => {
  let robot, user

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error'
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz'
    process.env.HUBOT_YOUTUBE_HEAR = 'true'
    nock.disableNetConnect()
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'youtube.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'alice',
        real_name: 'Alice Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('alice')
  })

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL
    delete process.env.HUBOT_YOUTUBE_API_KEY
    delete process.env.HUBOT_YOUTUBE_HEAR
    nock.cleanAll()
    nock.enableNetConnect()
    robot.shutdown()
  })

  it('retrieves a random video', (done) => {
    // Set up the success conditions
    robot.adapter.on('send', function (envelope, strings) {
      expect(strings[0]).to.match(/^https:\/\/www\.youtube\.com\/watch\?v=(.*)/i)
      done()
    })

    // Mock the API response
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
    .replyWithFile(200, path.resolve(__dirname, 'fixtures', 'search-random.json'))

    // Run the test
    robot.adapter.receive(new TextMessage(user, 'yt star wars'))
  })
})

describe('youtube deterministic', () => {
  let robot, user

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error'
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz'
    process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS = 'true'
    nock.disableNetConnect()
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'youtube.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'alice',
        real_name: 'Alice Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('alice')
  })

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL
    delete process.env.HUBOT_YOUTUBE_API_KEY
    delete process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS
    nock.cleanAll()
    nock.enableNetConnect()
    robot.shutdown()
  })

  it('retrieves the top video', (done) => {
    // Set up the success conditions
    robot.adapter.on('send', function (envelope, strings) {
      expect(strings[0]).to.equal('https://www.youtube.com/watch?v=bL_PDgczHJc')
      done()
    })

    // Mock the API response
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
    .replyWithFile(200, path.resolve(__dirname, 'fixtures', 'search-single.json'))

    // Run the test
    robot.adapter.receive(new TextMessage(user, 'hubot yt star wars'))
  })
})

describe('youtube display video title', () => {
  let robot, user

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error'
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz'
    process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS = 'true'
    process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE = 'true'
    nock.disableNetConnect()
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'youtube.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'alice',
        real_name: 'Alice Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('alice')
  })

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL
    delete process.env.HUBOT_YOUTUBE_API_KEY
    delete process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS
    delete process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE
    nock.cleanAll()
    nock.enableNetConnect()
    robot.shutdown()
  })

  it('displays the video title along with the URL', (done) => {
    // Set up the success conditions
    robot.adapter.on('send', function (envelope, strings) {
      expect(strings[0]).to.equal('Why Hayden Christensen Played Anakin PERFECTLY &#45; Star Wars Explained - https://www.youtube.com/watch?v=bL_PDgczHJc')
      done()
    })

    // Mock the API response
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
    .replyWithFile(200, path.resolve(__dirname, 'fixtures', 'search-single.json'))

    // Run the test
    robot.adapter.receive(new TextMessage(user, 'hubot yt star wars'))
  })
})

describe('youtube decode HTML', () => {
  let robot, user

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error'
    process.env.HUBOT_YOUTUBE_API_KEY = 'foobarbaz'
    process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS = 'true'
    process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE = 'true'
    process.env.HUBOT_YOUTUBE_DECODE_HTML = 'true'
    nock.disableNetConnect()
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'youtube.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'alice',
        real_name: 'Alice Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('alice')
  })

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL
    delete process.env.HUBOT_YOUTUBE_API_KEY
    delete process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS
    delete process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE
    delete process.env.HUBOT_YOUTUBE_DECODE_HTML
    nock.cleanAll()
    nock.enableNetConnect()
    robot.shutdown()
  })

  it('displays the HTML-decoded video title along with the URL', (done) => {
    // Set up the success conditions
    robot.adapter.on('send', function (envelope, strings) {
      expect(strings[0]).to.equal('Why Hayden Christensen Played Anakin PERFECTLY - Star Wars Explained - https://www.youtube.com/watch?v=bL_PDgczHJc')
      done()
    })

    // Mock the API response
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
    .replyWithFile(200, path.resolve(__dirname, 'fixtures', 'search-single.json'))

    // Run the test
    robot.adapter.receive(new TextMessage(user, 'hubot yt star wars'))
  })
})

describe('youtube missing config', () => {
  let robot, user

  beforeEach(() => {
    process.env.HUBOT_LOG_LEVEL = 'error'
    nock.disableNetConnect()
    robot = new Robot(null, 'mock-adapter-v3', false, 'hubot')
    robot.loadFile(path.resolve('src/'), 'youtube.js')
    robot.adapter.on('connected', () => {
      robot.brain.userForId('1', {
        name: 'alice',
        real_name: 'Alice Doe',
        room: '#test'
      })
    })
    robot.run()
    user = robot.brain.userForName('alice')
  })

  afterEach(() => {
    delete process.env.HUBOT_LOG_LEVEL
    nock.cleanAll()
    nock.enableNetConnect()
    robot.shutdown()
  })

  it('returns a configuration error', (done) => {
    // Set up the success conditions
    robot.adapter.on('send', function (envelope, strings) {
      expect(strings[0]).to.equal('You must configure the HUBOT_YOUTUBE_API_KEY environment variable')
      done()
    })

    // Run the test
    robot.adapter.receive(new TextMessage(user, 'hubot yt star wars'))
  })
})
