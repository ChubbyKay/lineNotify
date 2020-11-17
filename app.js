const express = require('express')

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('the app is running')
})

app.listen(PORT, () => {
  console.log(`notifyBot is running on localhost:${PORT}`)
})