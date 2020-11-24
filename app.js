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

    const $ = cheerio.load(infos.data)
    const list = $('.r-list-container .r-ent')
    for (let i = 0; i < list.length - 4; i++) {
      let crawlTitle = list.eq(i).find('.title a').text()
      let crawlComment = list.eq(i).find('.nrec span').text()
      let crawlDate = list.eq(i).find('.date').text()
      let crawlLink = list.eq(i).find('a').attr('href')
      let crawlUrl = pttBaseUrl + crawlLink

      result.push({ crawlTitle, crawlComment, crawlDate, crawlUrl })
    }
    // // 篩選標題
    // const titleResults = Object.values(result).map(item => item.crawlTitle)
    // function filterItems(query) {
    //   return titleResults.filter(function (el) {
    //     return el.toLowerCase().indexOf(query.toLowerCase()) > -1
    //   })
    // }
    // console.log(filterItems('徵才'))

    // // 篩選推文數
    // const filterComment = Object.values(result).filter(item => item.crawlComment > 10)
    // console.log(filterComment)

    // // 只能送單一則 result，不然會顯示不支援 arrays
    // let message = `${Object.values(result[0])}`

    let message = `\n標題：${result[1].crawlTitle} \n推文數：${result[1].crawlComment}\n發布日期：${result[1].crawlDate}\n網址：${result[1].crawlUrl}`
    console.log('message =====> ', message)

    return message
  })
    .catch((error) => {
      console.log(error)
    })
}
crawlerPtt()

// 傳送 line notify 訊息
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