const { loadEnvFile } = require('node:process')
const http = require('node:http')
const dbUtils = require('./utils/db.test')
const httpUtils = require('./utils/http.test')

loadEnvFile('./.env')

const PORT = process.env.PORT || 3501
const HOST = process.env.HOST || '127.0.0.1'

const server = http.createServer(async (req, res) => {
  try {
    // parse and attach body
    req.body = await httpUtils.parseRequestBody(req)

    // now you can use req.body anywhere
    console.log('Parsed body:', req.body)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ received: req.body }))
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
})


// const data = {
//    // _id: 'id-1767057200382',
//     name: 'Abimbola Fadipe',
//     age: '18',
//     career: 'Mechanical ENGINEER',
//     hobby: 'CODING',
// }

// async function intiTest() {
//     try {
//         const rec = await dbUtils.upsertJsonDoc('model/users/users.json', data)
//         //const deleted = await dbUtils.deleteById('model/users/users.json', 'id-function now() { [native code] }')
//         console.log('RECORD FETCHED:', rec)
//     } catch(err) {
//         throw new Error(err.message)
//     }
// }
// intiTest()



server.listen(PORT, HOST, () => {
    console.log(`Server run on - http://${HOST}:${PORT}`)
})