import http from 'node:http'
import path from 'node:path'
import { testThreeSum, testtwoSum, testtwoSumWhile } from './code/n-sum/run.js'
import { twoSumBrute, twoSumMapWhile } from './code/n-sum/two-some.js'

const PORT = 3500
const HOST = '127.0.0.1'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end('App Lunched Successfully')
})



console.log('TESTING TWO SUM', testtwoSum([2, 5, 7, 8, 1, 15], 7))
console.log('TESTING TWO SUM', testtwoSumWhile([2, 5, 7, 80, 1, 45], 82))
console.log('TESTING THREE SUM', testThreeSum([2, 5, 7, 80, 1, 45], 87))

server.listen(PORT, HOST, () => {
  console.log(`System server running on address: http://${HOST}:${PORT}`)
})

/* import http from "http"
import { Request, Response } from "./types/http.type.js"
import { runFib } from "./code/fibonacci/run.js"
// import { runReverseString } from "./code/pages/run.js"
// import { runThreeSum, runTwoSome } from "./code/n-sum/run.js"

const PORT = 3500

const server = http.createServer((req: Request, res: Response) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Server is running")
})

//runReverseString()
// runTwoSome()
// runThreeSum()
runFib()

//runMore()

server.listen(PORT, () => {
  console.log(`[APP ENTRY - src/server.ts] Server running on port ${PORT}`)
})
 */