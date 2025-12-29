const dbTools = require('../utils/db.helper')

class BaseController {

    constructor() {
        if (new.target === BaseController) {
            throw new Error('BaseController is abstract and cannot be instantiated directly')
        }
    }

  async fetchAll(docPath) {
    return dbTools.readJsonDoc(docPath)
  }

  async fetchById(docPath, _id) {
    return dbTools.readJsonDoc(docPath, _id)
  }

  async create(docPath, data) {
    return dbTools.upsertJsonDoc(docPath, data)
  }

  async update(docPath, data) {
    // data already contains _id for PUT semantics
    return dbTools.upsertJsonDoc(docPath, data)
  }

  async delete(docPath, _id) {
    return dbTools.deleteById(docPath, _id)
  }

  async _sendResponse(
    res,
    { status = 200, data = null, message = '', error = null }
    ) {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')

        const isSerialized = (data) => typeof data === 'string'
        const isError = !!error

        const normalisedData = isSerialized(data) ? data : dbTools._serialize(data)

        let payload
        if (isError) {
            payload = { success: false, data: null, error, message }
        } else {
            payload = { success: true, data: normalisedData, error: null, message }
        }

        res.end(isSerialized(payload) ? payload : dbTools._serialize(payload))

    }






}

module.exports = BaseController
