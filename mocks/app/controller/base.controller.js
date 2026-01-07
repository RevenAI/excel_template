const dbUtils = require('../utils/db.test')
const { httpTools } = require('../utils/http.helper')

class BaseController {

    constructor() {
        if (new.target === BaseController) {
            throw new Error('BaseController is abstract and cannot be instantiated directly')
        }
    }

  async fetchAll(docPath) {
    return dbUtils.readJsonDoc(docPath)
  }

  async fetchById(docPath, _id) {
    return dbUtils.readJsonDoc(docPath, _id)
  }

  async create(docPath, data) {
    return dbUtils.upsertJsonDoc(docPath, data)
  }

  async update(docPath, data) {
    // data already contains _id for PUT semantics
    return dbUtils.upsertJsonDoc(docPath, data)
  }

  async delete(docPath, _id) {
    return dbUtils.deleteById(docPath, _id)
  }

  // async _sendResponse(
  //   res,
  //   { status = 200, data = null, message = '', error = null }
  //   ) {
  //       res.statusCode = status
  //       res.setHeader('Content-Type', 'application/json')

  //       const isSerialized = (data) => typeof data === 'string'
  //       const isError = !!error

  //       const normalisedData = isSerialized(data) ? data : dbUtils._serialize(data)

  //       let payload
  //       if (isError) {
  //           payload = { success: false, data: null, error, message }
  //       } else {
  //           payload = { success: true, data: normalisedData, error: null, message }
  //       }

  //       res.end(isSerialized(payload) ? payload : dbUtils._serialize(payload))

  //   }

  async _sendResponse(
    res,
    { status = 200, data = null, message = '', error = null }
  ) {
  return httpTools.sendResponse(
    res,
    { status, data, message, error }
  )
  
  }






}

module.exports = BaseController
