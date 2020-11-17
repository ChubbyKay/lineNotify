const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

const app = express()
const PORT = 3000

// 測試 soft-job 版爬蟲
const pttUrl = 'https://www.ptt.cc'
request({
  url: `${pttUrl}/bbs/Soft_Job/index.html`
}, (err, res, body) => {
  if (err || !body) {
    return
  }
  let result = []
  const $ = cheerio.load(body)
  const list = $('.r-list-container .r-ent')
  for (let i = 0; i < list.length - 4; i++) {
    const title = list.eq(i).find('.title a').text()
    const author = list.eq(i).find('.author').text()
    const date = list.eq(i).find('.date').text()
    const link = list.eq(i).find('a').attr('href')
    const url = pttUrl + link

    result.push({ title, author, date, url })
  }

  console.log(result)
})

app.get('/', (req, res) => {
  res.send('the app is running')
})

app.listen(PORT, () => {
  console.log(`notifyBot is running on localhost:${PORT}`)
})