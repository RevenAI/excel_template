const http = require('node:http')

const userRouter = require('./routes/users.route')
const productRouter = require('./routes/products.route')

const PORT = Number(process.env.PORT) || 3501
const HOST = process.env.HOST || '127.0.0.1'

const server = http.createServer(async (req, res) => {
    // Try routes one by one
    const handledByUser = await userRouter(req, res)
    if (handledByUser) return

    const handledByProduct = await productRouter(req, res)
    if (handledByProduct) return

    // Fallback: route not found
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
        success: false,
        message: 'Route not found'
    }))
})

server.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})
