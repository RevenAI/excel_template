const BaseController = require("../base.controller")
const AppError = require('../../utils/http.error')

class UserController extends BaseController {
    constructor() {
        super()
        this.docPath = 'users/users.json' //default path for users
    }

    // GET /users
    getAllUsers = AppError.asyncHandler(async (req, res) => {
        const users = await this.fetchAll(this.docPath)
        await this._sendResponse(res, { status: AppError.statusMessage.OK, data: users })
    })

    // GET /users/:id
    getUserById = AppError.asyncHandler(async (req, res) => {
        const _id = req.params?.id
        if (!_id) throw new AppError(AppError.statusMessage.BAD_REQUEST, 'User ID is required')

        const user = await this.fetchById(this.docPath, _id)
        if (!user) throw new AppError(AppError.statusMessage.NOT_FOUND, 'User not found')

        await this._sendResponse(res, { status: AppError.statusMessage.OK, data: user })
    })

    // POST /users
    createUser = AppError.asyncHandler(async (req, res) => {
        const data = req.body
        if (!data || Object.keys(data).length === 0) {
            throw new AppError(AppError.statusMessage.UNPROCESSABLE_ENTITY, 'User data is required')
        }

        const created = await this.create(this.docPath, data)
        await this._sendResponse(res, { status: AppError.statusMessage.CREATED, data: created, message: 'User created successfully' })
    })

    // PUT /users/:id
    updateUser = AppError.asyncHandler(async (req, res) => {
        const _id = req.params?.id
        const updates = req.body

        if (!_id) throw new AppError(AppError.statusMessage.BAD_REQUEST, 'User ID is required')
        if (!updates || Object.keys(updates).length === 0) {
            throw new AppError(AppError.statusMessage.UNPROCESSABLE_ENTITY, 'Update data is required')
        }

        // Ensure _id is included for PUT semantics
        const updated = await this.update(this.docPath, { _id, ...updates })
        await this._sendResponse(res, { status: AppError.statusMessage.OK, data: updated, message: 'User updated successfully' })
    })

    // DELETE /users/:id
    deleteUser = AppError.asyncHandler(async (req, res) => {
        const _id = req.params?.id
        if (!_id) throw new AppError(AppError.statusMessage.BAD_REQUEST, 'User ID is required')

        const deleted = await this.delete(this.docPath, _id)
        await this._sendResponse(res, { status: AppError.statusMessage.OK, data: deleted, message: 'User deleted successfully' })
    })
}

module.exports = new UserController()
