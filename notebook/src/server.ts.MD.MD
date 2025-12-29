import { Request, Response } from "./types/http.type.js"
import http from 'http'
import { router } from "./routes/app.route.js"

const server = http.createServer((req: Request, res: Response) => {
  router.get(req, res, '/home', 'Hello Engineers!!')
})

const PORT = 3500
server.listen(PORT, () => {
    console.log('Server running on PORT: ' + PORT)
})


//CORRRECTED VERSION FOR THE ROUTES
/* 
router.get('/home', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('Hello Engineers!!')
})

const server = http.createServer((req, res) => {
  router.handle(req, res)
})

*/