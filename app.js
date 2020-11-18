if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')
const exphbs = require('express-handlebars')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const pttUrl = 'https://www.ptt.cc'

app.get('/', (req, res) => {
  axios.get(`${pttUrl}/bbs/Soft_Job/index.html`)
    .then((infos) => {
      let result = []
      const $ = cheerio.load(infos.data)
      const list = $('.r-list-container .r-ent')
      for (let i = 0; i < list.length - 4; i++) {
        const title = list.eq(i).find('.title a').text()
        const author = list.eq(i).find('.author').text()
        const date = list.eq(i).find('.date').text()
        const link = list.eq(i).find('a').attr('href')
        const url = pttUrl + link

        result.push({ title, author, date, url })
      }
      res.render('index', { result })
    })
    .catch((error) => {
      console.log(error)
    })
})

function lineNotify() {
  const token = process.env.LINE_TOKEN

  const form_data = new FormData()
  form_data.append('message', '測試 Line Notify 訊息 from coding')

  const headers = Object.assign({
    'Authorization': `Bearer ${token}`
  }, form_data.getHeaders())

  axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    data: form_data,
    headers: headers
  }).then(function (response) {
    console.log('HTTP 狀態碼：' + response)
    console.log(response.data)
  }).catch(function (error) {
    console.error('Line 通知訊息發送失敗')
    if (error.response) {
      console.error('HTTP 狀態碼：' + error)
      console.error(error.response.data)
    } else {
      console.error(error)
    }
  })
}
lineNotify()
console.log(lineNotify())

app.listen(PORT, () => {
  console.log(`notifyBot is running on localhost:${PORT}`)
})