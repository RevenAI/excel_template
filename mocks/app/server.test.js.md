/* const { loadEnvFile } = require('node:process')
const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs/promises')
const requestHelpers = require('./utils/http.test')


//constants
const PORT = process.env.PORT || 3501
const HOST = process.env.HOST || '127.0.0.1'

const server = http.createServer((req, res) => {

   async function attacthPayload(req) {
     req.body = await requestHelpers.parseReqBody(req)
   }
   attacthPayload()

   //get all
   async function getAllUsers() {
        if (requestHelpers.isGetRoute(req, '/users')) {
       try {
         const id = requestHelpers.extractRouteParam(req)
         const 
       } catch(error) {

       }
        
        
    }
   }
   getAllUsers()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('App is running fine!!')
})


server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
}) */