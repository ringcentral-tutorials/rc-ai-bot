/**
 * convert voice mail stream to flac format
 * then convert flat buffer to base64 string
 * for google speech to text api
 */

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const fetch = require('node-fetch')
const handleError = require('../common/error-handler')
const {Writable} = require('stream')

ffmpeg.setFfmpegPath(ffmpegPath)

class FakeWrite extends Writable {
  constructor(opts) {
    super(opts)
    this.opts = opts
  }

  _write(data, encoding, done) {
    this.opts.onData(data)
    done()
  }
}

function handleResponse(res) {
  console.log('into')
  console.log(res.body instanceof require('stream').Readable)
  return new Promise((resolve, reject) => {
    let final = new Buffer('')
    let writeStream = new FakeWrite({
      onData: data => {
        final = Buffer.concat(
          [final, data]
        )
      }
    })
    writeStream.on('finish', () => {
      resolve(final.toString('base64'))
    })
    ffmpeg(res.body)
      .withAudioChannels(1)
      .withAudioFrequency(16000)
      .withAudioQuality(5)
      .withOutputFormat('flac')
      .on('start', (commandLine) => {
        console.log('ffmpeg conversion start: ', commandLine)
      })
      .on('progress', function(progress) {
        //console.log('Processing: ' + progress.percent + '% done')
      })
      .on('stderr', function(stderrLine) {
        //console.log('Stderr output: ' + stderrLine)
        //reject(stderrLine)
      })
      .on('codecData', function(data) {
        console.log(data)
        //console.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video')
        //final += data.audio.toString('base64')
      })
      .on('data', data => {
        final += data.toString('base64')
      })
      .on('end', () => {
        console.log('convert end')
        //resolve(final)
      })
      .on('error', (error) => {
        console.log(error)
        reject(error)
      })
      .pipe(writeStream)
      // .save(
      //   require('path').resolve(__dirname, '../../f.flac')
      // )
  })

}

async function toFlac(url) {
  return fetch(url)
    .then(handleResponse)
    .catch(handleError)
}

module.exports = {
  toFlac
}
