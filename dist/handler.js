
const r = require('./lib/test')

exports.bot = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      r: r(),
      env: process.env
    })
  }
}

