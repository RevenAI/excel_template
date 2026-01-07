
class RequestHelpers {


    isGetRoute = (req, route) => req.url === route && req.method === 'GET'
    isPostRoute = (req, route) => req.url === route && req.method === 'POST'
    isPutRoute = (req, route) => req.url.startsWith(route) && req.method === 'PUT'
    isDeleteRoute = (req, route) => req.url.startsWith(route) && req.method === 'DELETE'

    extractRouteParam(req, paramPos=-1) {
     return req.url.split('?')[0].split('/')[paramPos]
    }

    extractQueryParam(req, queryPos=-1) {
     return req.url.split('?')[1]
    }


    parseReqBody(req, { maxSize = 10_000_000 } = {}) {
        return new Promise((resolve, reject) => {
            const contentType = req.headers['content-type'] || ''
            if (!contentType.includes('application/json')) {
                return reject(new Error('Invalid content type'))
            }

            let body
            let size = 0

            req.on('data', chunk => {
                size += chunk.length
                if (size > maxSize) {
                    reject(new Error('Payload too large'))
                    req.destroy()
                    return
                }
                body += chunk
            })

            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {})
                } catch(error) {
                    reject(new Error('Failed to resolve request payload'))
                }
            })

            req.on('error', error => reject(error))
        })
    }

    sendResponse(res, { status = 200, data = {}, message = '', error = null }) {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')

        let payload
        if (error) {
            payload = { success: false, data: null, message, error }
        } else {
            payload = { success: true, data: this._serialize(data), message, status }
        }

        res.end(this._isSerialized(payload) ? payload : this._serialize(payload))
    }


    //private and protected method
    _isSerialized = (data) => typeof data === 'string'
    _serialize = (data) => JSON.stringify(data, null, 2)
}

const requestHelpers = new RequestHelpers()
module.exports = requestHelpers