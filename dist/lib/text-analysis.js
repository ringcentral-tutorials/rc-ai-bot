/**
 * analysis text with google ai
 */

// Imports the Google Cloud client library
const language = require('@google-cloud/language')

// Instantiates a client
const client = new language.LanguageServiceClient()

function textAnalysis(text) {

  const document = {
    content: text,
    type: 'PLAIN_TEXT'
  }

  // Detects the sentiment of the text
  client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment
      console.log(`Text: ${text}`)
      console.log('Sentiment:', sentiment)
      console.log(`Sentiment score: ${sentiment.score}`)
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`)
      return {
        text,
        sentiment
      }
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}

module.exports = {
  textAnalysis
}
