class HttpTools {

    isPostRoute(req, path) {
        return req.method === 'POST' && this.checkRoute(req, path, true)
    }

    isGetRoute(req, path) {
        return req.method === 'GET' && this.checkRoute(req, path, true)
    }

    isPutRoute(req, path) {
        return req.method === 'PUT' && this.checkRoute(req, path, false)
    }

    isDeleteRoute(req, path) {
        return req.method === 'DELETE' && this.checkRoute(req, path, false)
    }

    extractIdFromPath(path) {
        const parts = path.split('?')[0].split('/')
        const id = parts[2]
        return id ? { hasID: true, id } : { hasID: false, id: null }
    }

    parseRequestBodyJson(req, { maxSize = 5_000_000 } = {}) {
        return new Promise((resolve, reject) => {
            // Validate the content type
            const contentType = req.headers['content-type'] || ''
            if (!contentType.includes('application/json')) {
                return reject(new Error('Unsupported content type'))
            }

            let body = ''
            let bytesRead = 0

            // Accumulate the data
            req.on('data', chunk => {
                bytesRead += chunk.length
                if (bytesRead > maxSize) {
                    reject(new Error('Payload too large'))
                    req.destroy() // Stop reading
                    return
                }
                body += chunk
            })

            // Resolve and parse the data
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {})
                } catch (error) {
                    reject(new Error('Invalid JSON'))
                }
            })

            // Handle errors
            req.on('error', err => reject(err))
        })
    }

    checkRoute(req, path, exactMatch = true) {
        return exactMatch
            ? req.url === path
            : req.url.startsWith(path)
    }
}

const httpTools = new HttpTools()
module.exports = { httpTools }
