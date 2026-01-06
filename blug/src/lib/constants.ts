
export const httpMethods = {
    GET: 'GET',
    PUT: 'PUT',
    PATCH: 'PATCH',
    POST: 'POST',
    DELETE: 'DELETE',
    OPTION: 'OPTION',
} as const
export type HttpMethods = typeof httpMethods[keyof typeof httpMethods]