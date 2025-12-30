
class HttpUtils {

    parseRequestBody(req, { maxSize = 10_000_000 } = {}) {
        return new Promise((resolve, reject) => {
            const contentType = req.headers['content-type'] || ''
            if (!contentType.includes('application/json')) {
                return reject(new Error('Invalid content type'))
            }

            let body = ''
            let size = 0
            //accumulate data
            req.on('data', chunk => {
               size += chunk.length
               if (size > maxSize) {
                reject(new Error('Payload too large'))
                req.destroy() //stop reading
                return
               }

               body += chunk
            })

            //process and store the data
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {})
                } catch(err) {
                    reject(new Error('Invalid payload'))
                }
            })

            req.on('error', (error) => reject(error))
        })
    }
}

const httpUtils = new HttpUtils()
module.exports = httpUtils