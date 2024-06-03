const express = require('express')
const app = express()
const route = require('./routers/user')

app.use(express.json())

app.use(route)

app.listen(3000, () => {
    console.log('Server is running in port 3000');
})