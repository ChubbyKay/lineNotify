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
    console.log('function crawPtt result ======>', result)
    return { 'result': result, 'title': title, 'comment': comment, 'date': date, 'url': url }
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

crawlerPtt()
  .then(data => {
    let message
    // console.log('crawPtt data.result[0]======>', data.result[0])
    // console.log('crawPtt data.title.comment[0]======>', data.title[0], data.comment[0], data.date[0], data.url[0])
    return message = `\n標題：${data.title[0]}` + `\n推文數：${data.comment[0]} ` + `\n發布日期：${data.date[0]}` + `\n網址：${data.url[0]}`
    // let message = Object.assign({}, data)
  })
  .catch(err => console.log(err))

async function lineNotify() {
  const token = process.env.LINE_TOKEN

  // const message = await crawlerPtt()
  //   .then(data => {
  //     let message
  //     return message = `\n標題：${data.title[0]}` + `\n推文數：${data.comment[0]} ` + `\n發布日期：${data.date[0]}` + `\n網址：${data.url[0]}`
  //   })
  //   .catch(err => console.log(err))
  // console.log('Line Notify message========>', message)

  // console.log('message============>', JSON.parse(message))
  // error ====> UnhandledPromiseRejectionWarning: SyntaxError: Unexpected token 標 in JSON at position 1

  // console.log('message========>', message)
  // ===>
  // 標題：[object Object]
  // 推文數：[object Object]
  // 發布日期：[object Object]
  // 網址：[object Object]

  // console.log('message========>', JSON.stringify(message))
  // ===> "\n標題：[object Object]\n推文數：[object Object] \n發布日期：[object Object]\n網址：[object Object]"

  // 加上 global.FormData = global.originalFormData 在React Native 檔案
  // ===> 加入後沒有反應

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