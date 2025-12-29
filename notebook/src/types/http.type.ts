import { IncomingMessage, ServerResponse } from "http"

/**
 * Custom Represents an HTTP request.
 * Extends Node's IncomingMessage with optional properties for body, route parameters, and query strings.
 */
export interface Request extends IncomingMessage {

    body?: any,
    params?: Record<string, string>,
    query?: Record<string, string>
}

/**
 * Custom Represents an HTTP response.
 * Extends Node's ServerResponse with an optional `json` helper function.
 */
export interface Response extends ServerResponse {
    json?: any
}

