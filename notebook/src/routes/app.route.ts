import { Request, Response } from "../types/http.type.js"
import url from 'url'

const HttpMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    OPTION: 'OPTION',
} as const

type TypeHTTP = typeof HttpMethods[keyof typeof HttpMethods]
type ResContent = string

class Router {


    public get(
        req: Request, 
        res: Response,
        route: string, 
        content: ResContent
    ) {
        if (this.isMatchRoute(req, route) && this.isGet(req)) {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content)
        }
    }

    private getPath(req: Request) {
        const parsedUrl = url.parse(String(req.url), true)
        return parsedUrl.pathname 
    }

    private isGet = (req: Request) => req.method === HttpMethods.GET 
    private isPost = (req: Request) => req.method === HttpMethods.POST
    private isPut = (req: Request) => req.method === HttpMethods.PUT
    private isPatch = (req: Request) => req.method === HttpMethods.PATCH
    private isDelete = (req: Request) => req.method === HttpMethods.DELETE
    private isOption = (req: Request) => req.method === HttpMethods.OPTION

    private isMatchRoute = (req: Request, route: string) => {
        const reqPath = this.getPath(req)
        return reqPath === route
    }
}

export const router =  new Router()


//CORRECTED VERSION
/* 
type Handler = (req: Request, res: Response) => void

class Router {
  private routes: Record<string, Handler> = {}

  public get(path: string, handler: Handler) {
    this.routes[`GET:${path}`] = handler
  }

  public handle(req: Request, res: Response) {
    const pathname = url.parse(req.url || '').pathname
    const key = `${req.method}:${pathname}`

    const handler = this.routes[key]
    if (handler) return handler(req, res)

    res.writeHead(404)
    res.end('Not Found')
  }
}

export const router = new Router()

*/