const userController = require('../controller/users/users.controller')
const { httpTools } = require('../utils/http.helper')

async function userRouter(req, res) {
    try {
        // GET /users
        if (httpTools.isGetRoute(req, '/users')) {
            return userController.getAllUsers(req, res)
        }

        // GET /users/:id
        if (httpTools.isGetRoute(req, '/users/') && !httpTools.isGetRoute(req, '/users')) {
            const { id } = httpTools.extractIdFromPath(req.url)
            if (!id) throw new Error('User ID is required')
            req.params = { id }
            return userController.getUserById(req, res)
        }

        // POST /users
        if (httpTools.isPostRoute(req, '/users')) {
            req.body = await httpTools.parseRequestBodyJson(req)
            return userController.createUser(req, res)
        }

        // PUT /users/:id
        if (httpTools.isPutRoute(req, '/users/') && !httpTools.isPutRoute(req, '/users')) {
            const { id } = httpTools.extractIdFromPath(req.url)
            if (!id) throw new Error('User ID is required')
            req.params = { id }
            req.body = await httpTools.parseRequestBodyJson(req)
            return userController.updateUser(req, res)
        }

        // DELETE /users/:id
        if (httpTools.isDeleteRoute(req, '/users/') && !httpTools.isDeleteRoute(req, '/users')) {
            const { id } = httpTools.extractIdFromPath(req.url)
            if (!id) throw new Error('User ID is required')
            req.params = { id }
            return userController.deleteUser(req, res)
        }

        // Unknown user route
        return false
    } catch (err) {
        res.statusCode = 500
        res.end(JSON.stringify({ success: false, message: err.message }))
    }
}

module.exports = userRouter
