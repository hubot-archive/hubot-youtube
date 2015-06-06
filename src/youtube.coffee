# Description:
#   YouTube video search
#
# Configuration:
#   HUBOT_YOUTUBE_API_KEY - Obtained from https://console.developers.google.com
#
# Commands:
#   hubot youtube me <query> - Searches YouTube for the query and returns the video embed link.
module.exports = (robot) ->
  robot.respond /(?:youtube|yt)(?: me)? (.*)/i, (msg) ->
    unless process.env.HUBOT_YOUTUBE_API_KEY
      return msg.send "You must configure the HUBOT_YOUTUBE_API_KEY environment variable"
    query = msg.match[1]
    robot.http("https://www.googleapis.com/youtube/v3/search")
      .query({
        order: 'relevance'
        part: 'snippet'
        type: 'video'
        maxResults: 15
        q: query
        key: process.env.HUBOT_YOUTUBE_API_KEY
      })
      .get() (err, res, body) ->
        videos = JSON.parse(body)
        videos = videos.items

        unless videos? && videos.length > 0
          return msg.send "No video results for \"#{query}\""

        video  = msg.random videos
        msg.send "https://www.youtube.com/watch?v=#{video.id.videoId}"
