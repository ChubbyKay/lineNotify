if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')
const exphbs = require('express-handlebars')
const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// // 測試網頁可否得到資料
// const pttBaseUrl = 'https://www.ptt.cc'

// app.get('/', (req, res) => {
//   axios.get(`${pttBaseUrl}/bbs/Soft_Job/index.html`)
//     .then((infos) => {
//       let result = []
//       const $ = cheerio.load(infos.data)
//       const list = $('.r-list-container .r-ent')
//       for (let i = 0; i < list.length - 4; i++) {
//         const title = list.eq(i).find('.title a').text()
//         const comment = list.eq(i).find('.nrec span').text()
//         const date = list.eq(i).find('.date').text()
//         const link = list.eq(i).find('a').attr('href')
//         const url = pttBaseUrl + link

//         result.push({ title, comment, date, url })
//       }
//       res.render('index', { result })
//     })
//     .catch((error) => {
//       console.log(error)
//     })
// })

function crawlerPtt() {
  const pttBaseUrl = 'https://www.ptt.cc'
  return axios({
    method: 'get',
    url: `${pttBaseUrl}/bbs/Soft_Job/index.html`
  }).then((infos) => {
    let result = []
    let title = []
    let comment = []
    let date = []
    let url = []

    const $ = cheerio.load(infos.data)
    const list = $('.r-list-container .r-ent')
    for (let i = 0; i < list.length - 4; i++) {
      let crawTitle = list.eq(i).find('.title a').text()
      let crawComment = list.eq(i).find('.nrec span').text()
      let crawDate = list.eq(i).find('.date').text()
      let crawLink = list.eq(i).find('a').attr('href')
      let crawUrl = pttBaseUrl + crawLink

      result.push({ crawTitle, crawComment, crawDate, crawUrl })
      title.push({ crawTitle })
      comment.push({ crawComment })
      date.push({ crawDate })
      url.push({ crawUrl })
    }
    let message = `\n標題：${Object.values(title[1])} \n推文數：${Object.values(comment[1])}\n發布日期：${Object.values(date[1])}\n網址：${Object.values(url[1])}`
    console.log('message =====> ', message)

    return message
    // return { 'result': result, 'title': title, 'comment': comment, 'date': date, 'url': url }
  })
    .catch((error) => {
      console.log(error)
    })
}
console.log('============================================')
crawlerPtt()

// app.get('/', (req, res) => {
//   crawlerPtt()
//     .then(data => {
//       res.json({ message: 'Request received!', data })
//       console.log(data)
//     })
//     .catch(err => console.log(err))
// })


async function lineNotify() {
  const token = process.env.LINE_TOKEN

  const message = await crawlerPtt()

  // 使用 form-data 傳遞資料
  const form_data = new FormData()
  form_data.append('message', message)

  // 設定權杖
  const headers = Object.assign({
    'Authorization': `Bearer ${token}`
  }, form_data.getHeaders())

  await axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    data: form_data,
    headers: headers
  }).then(function (response) {
    console.log('HTTP 狀態碼：' + response.status)
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

app.listen(PORT, () => {
  console.log(`notifyBot is running on localhost:${PORT}`)
})