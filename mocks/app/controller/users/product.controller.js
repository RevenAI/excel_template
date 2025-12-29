const BaseController = require('../base.controller')
const AppError = require('../utils/AppError')

class ProductController extends BaseController {
    constructor() {
        super()
        this.docPath = 'products/products.json' // default path for products
    }

    // GET /products
    getAllProducts = AppError.asyncHandler(async (req, res) => {
        const products = await this.fetchAll(this.docPath)
        await this._sendResponse(res, {
            status: AppError.statusMessage.OK,
            data: products
        })
    })

    // GET /products/:id
    getProductById = AppError.asyncHandler(async (req, res) => {
        const _id = req.params?.id
        if (!_id) {
            throw new AppError(
                AppError.statusMessage.BAD_REQUEST,
                'Product ID is required'
            )
        }

        const product = await this.fetchById(this.docPath, _id)
        if (!product) {
            throw new AppError(
                AppError.statusMessage.NOT_FOUND,
                'Product not found'
            )
        }

        await this._sendResponse(res, {
            status: AppError.statusMessage.OK,
            data: product
        })
    })

    // POST /products
    createProduct = AppError.asyncHandler(async (req, res) => {
        const data = req.body
        if (!data || Object.keys(data).length === 0) {
            throw new AppError(
                AppError.statusMessage.UNPROCESSABLE_ENTITY,
                'Product data is required'
            )
        }

        const created = await this.create(this.docPath, data)
        await this._sendResponse(res, {
            status: AppError.statusMessage.CREATED,
            data: created,
            message: 'Product created successfully'
        })
    })

    // PUT /products/:id
    updateProduct = AppError.asyncHandler(async (req, res) => {
        const _id = req.params?.id
        const updates = req.body

        if (!_id) {
            throw new AppError(
                AppError.statusMessage.BAD_REQUEST,
                'Product ID is required'
            )
        }

        if (!updates || Object.keys(updates).length === 0) {
            throw new AppError(
                AppError.statusMessage.UNPROCESSABLE_ENTITY,
                'Update data is required'
            )
        }

        const updated = await this.update(this.docPath, { _id, ...updates })
        await this._sendResponse(res, {
            status: AppError.statusMessage.OK,
            data: updated,
            message: 'Product updated successfully'
        })
    })

    // DELETE /products/:id
    deleteProduct = AppError.asyncHandler(async (req, res) => {
        const _id = req.params?.id
        if (!_id) {
            throw new AppError(
                AppError.statusMessage.BAD_REQUEST,
                'Product ID is required'
            )
        }

        const deleted = await this.delete(this.docPath, _id)
        await this._sendResponse(res, {
            status: AppError.statusMessage.OK,
            data: deleted,
            message: 'Product deleted successfully'
        })
    })
}

module.exports = new ProductController()
