'use strict'

// Description
//   YouTube video search
//
// Configuration:
//   HUBOT_YOUTUBE_API_KEY - Obtained from https://console.developers.google.com
//   HUBOT_YOUTUBE_DETERMINISTIC_RESULTS - Optional boolean flag to only fetch
//     the top result from the YouTube search
//   HUBOT_YOUTUBE_HEAR - Optional boolean flag to globally hear from channels
//   HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE - Optional boolean flag to display the
//     video title of the returned video
//   HUBOT_YOUTUBE_DECODE_HTML - Optional boolean flag to decode HTML entities
//     from the video title
//
// Commands:
//   hubot youtube me <query> - Searches YouTube for the query and returns the video embed link.

const he = require('he');

module.exports = function (robot) {
  let resType = 'respond'
  let trigger = /(?:youtube|yt)(?: me)? (.*)/i
  if (process.env.HUBOT_YOUTUBE_HEAR === 'true') {
    resType = 'hear'
    trigger = /^(?:youtube|yt)(?: me)? (.*)/i
  }

  return robot[resType](trigger, function (msg) {
    if (!process.env.HUBOT_YOUTUBE_API_KEY) {
      robot.logger.error('HUBOT_YOUTUBE_API_KEY is not set.')
      return msg.send('You must configure the HUBOT_YOUTUBE_API_KEY environment variable')
    }
    const query = msg.match[1]
    const maxResults = process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS === 'true' ? 1 : 15
    robot.logger.debug(`Query: ${query}\n Max Results: ${maxResults}`)
    return robot.http('https://www.googleapis.com/youtube/v3/search')
    .query({
      order: 'relevance',
      part: 'snippet',
      type: 'video',
      maxResults,
      q: query,
      key: process.env.HUBOT_YOUTUBE_API_KEY
    })
    .get()(function (err, res, body) {
      let error, videos
      robot.logger.debug(body)
      if (err) {
        robot.logger.error(err)
        return robot.emit('error', err, msg)
      }
      try {
        if (res.statusCode === 200) {
          videos = JSON.parse(body)
          robot.logger.debug(`Videos: ${JSON.stringify(videos)}`)
        } else {
          return robot.emit('error', `${res.statusCode}: ${body}`, msg)
        }
      } catch (error1) {
        error = error1
        robot.logger.error(error)
        return msg.send(`Error! ${body}`)
      }
      if (videos.error) {
        robot.logger.error(videos.error)
        return msg.send(`Error! ${JSON.stringify(videos.error)}`)
      }
      videos = videos.items
      if ((videos == null) || !(videos.length > 0)) {
        return msg.send(`No video results for \"${query}\"`)
      }
      const video = msg.random(videos)
      let output = `https://www.youtube.com/watch?v=${video.id.videoId}`
      if (process.env.HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE === 'true') {
        let videoTitle = video.snippet.title
          if (process.env.HUBOT_YOUTUBE_DECODE_HTML === 'true') {
            videoTitle = he.decode(videoTitle)
          }
        output = `${videoTitle} - ` + output
      }
      return msg.send(output)
    })
  })
}
