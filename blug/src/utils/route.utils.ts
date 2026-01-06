import { resolve } from "node:path"
import { httpMethods } from "../lib/constants.js"
import { Request, Route } from "../types/http.type.js"
import url from 'node:url'
import { parseToJson } from "./parser.utils.js"
import { error } from "node:console"

class RouteUtils {

    _getParseReqUrl(req: Request): string {
        const parsed = url.parse(req.url || '/', true)
        return String(parsed)
    }



    
    isGetRoute = (req: Request, route: Route) => this._getParseReqUrl(req) === route
                                        && req.method === httpMethods.GET
    isPostRoute = (req: Request, route: Route) => this._getParseReqUrl(req) === route 
                                        && req.method === httpMethods.POST
    isPutRoute = (req: Request, route: Route) => this._getParseReqUrl(req).startsWith(route)
                                        && req.method === httpMethods.PUT
    isDeleteRoute = (req: Request, route: Route) => this._getParseReqUrl(req).startsWith(route)
                                        && req.method === httpMethods.DELETE
    isPatchRoute = (req: Request, route: Route) => this._getParseReqUrl(req).startsWith(route)
                                        && req.method === httpMethods.PATCH
    
    extractParamsFromRoute(req: Request) {
        return this._getParseReqUrl(req).split('?')[0].split('/')[-1]
    }

    parsedRequestBody(req: Request, options: { maxSize?: number } = {}) {
        return new Promise((resolve, reject) => {
            const contentType = req.headers['content-type'] || ''
            if (!contentType.includes('application/json')) {
                return reject(new Error('Invalid content type'))
            }

            let body: string = ''
            let size: number = 0
            const maxSize = options.maxSize ?? 0

            req.on('data', chunk => {
                size += chunk.length
                if (size > maxSize) {
                    reject(new Error('Payload too large'))
                    req.destroy() //stop reading
                    return
                }

                body += chunk
            })

            req.on('end', () => {
                try {
                    resolve(body ? parseToJson(body) : {})
                } catch(error) {
                    reject(new Error('Failed to process the request data'))
                }
            })

            req.on('error', error => reject(error))
        })
    }
}

export const routeUtils = new RouteUtils()
