const productController = require('../controllers/ProductController')
const { httpTools } = require('../utils/HttpTools')

async function productRouter(req, res) {
    try {
        // GET /products
        if (httpTools.isGetRoute(req, '/products')) {
            await productController.getAllProducts(req, res)
            return true
        }

        // GET /products/:id
        if (httpTools.isGetRoute(req, '/products/') && !httpTools.isGetRoute(req, '/products')) {
            const { id } = httpTools.extractIdFromPath(req.url)
            req.params = { id }
            await productController.getProductById(req, res)
            return true
        }

        // POST /products
        if (httpTools.isPostRoute(req, '/products')) {
            req.body = await httpTools.parseRequestBodyJson(req)
            await productController.createProduct(req, res)
            return true
        }

        // PUT /products/:id
        if (httpTools.isPutRoute(req, '/products/') && !httpTools.isPutRoute(req, '/products')) {
            const { id } = httpTools.extractIdFromPath(req.url)
            req.params = { id }
            req.body = await httpTools.parseRequestBodyJson(req)
            await productController.updateProduct(req, res)
            return true
        }

        // DELETE /products/:id
        if (httpTools.isDeleteRoute(req, '/products/') && !httpTools.isDeleteRoute(req, '/products')) {
            const { id } = httpTools.extractIdFromPath(req.url)
            req.params = { id }
            await productController.deleteProduct(req, res)
            return true
        }

        return false
    } catch (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, message: err.message }))
        return true
    }
}

module.exports = productRouter
