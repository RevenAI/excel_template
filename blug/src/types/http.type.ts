import { IncomingMessage, ServerResponse } from 'node:http'

export interface Request extends IncomingMessage {
    body: any
    params: Record<string, string>
    query: Record<string, string>
}

export interface Response extends ServerResponse {
    json: any
}

export type Route = string