if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
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

app.listen(PORT, () => {
  console.log(`notifyBot is running on localhost:${PORT}`)
})