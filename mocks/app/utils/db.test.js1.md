const fs = require('node:fs/promises')
const path = require('node:path')

class HttpUtils {

    #UTF8 = 'utf8'

    constructor() {}

    //private and protected methods
    _parseJson = (d) => JSON.parse(d)
    _serialize = (d) => JSON.stringify(d, null, 2)
    _createDocTitleFromDir = (docPath) => path.basename(path.dirname(docPath))
    async _ensureDirExists(docPath) {
        const dir = path.dirname(docPath)
        console.log('TARGET DIRECTORY', dir)
        try {
            //await fs.access(dir, fs.constants.F_OK)
            await fs.access(dir)
            console.log('DIR ACCESS CHECKED')
            return
        } catch {
            console.log('DIR ACCESS FAILED - DIR CREATED')
            await fs.mkdir(dir, { recursive: true })
        }
    }

    //public methods
    async readJsonDoc(docPath, _id) {
        if (!docPath) throw new Error('Document path is required') 
        const title = this._createDocTitleFromDir(docPath)

       try {
         
        await this._ensureDirExists(docPath)
        const raw = await fs.readFile(docPath, this.#UTF8)

        if (!raw || raw.length === 0) {
            return { [title]: [] }
        }
        const parsed = this._parseJson(raw)
        const records = parsed[title] || []

        if (_id) {
            const record = records.find(r => r._id === _id)
            return { [title]: record ? [record] : [] }
        }

        return { [title]: records }
       } catch(error) {
        if (error.code === 'ENOENT') {
            return { [title]: [] }
        }
        throw error
       }
    }

    async upsertJsonDoc(docPath, data) {
        if (!docPath) throw new Error('Document path required')
        if (!data || (typeof data !== 'object' || Array.isArray(data))) {
            throw new Error('Invalid data provided')
        }

        const title = this._createDocTitleFromDir(docPath)
        try {

        await this._ensureDirExists(docPath)
        const existing = await this.readJsonDoc(docPath)
        const records = existing[title] || []

        //create
        if (!data?._id) {
            const newDoc = {
                 _id: `id-${Date.now()}`,
                ...data,
            }
            records.push(newDoc)
        } else {
            const index = records.findIndex(doc => doc._id === data._id)
            if (index === -1) {
                return { [title]: [] }
            }

            const { _id, ...safeUpdates } = data //ensure record integrity
            records[index] = {
                ...records[index],
                ...safeUpdates
            }

        }

        const result = { [title]: records }
        await fs.writeFile(docPath, this._serialize(result), this.#UTF8)

        return result
        } catch(error) {
            throw error
        }

    }

    async deleteById(docPath, _id) {
        if (!docPath) throw new Error('Document path required')
        if (!_id) throw new Error('Document ID required')

        try {
            const existing = await this.readJsonDoc(docPath)
            const title = this._createDocTitleFromDir(docPath)
            const records = existing[title] || []

            console.log('FIRST RECORD', records)
            console.log('TYPES OF RECORDS', typeof records.findIndex)
            const index = records.findIndex(rc => rc._id === _id)

            if (index === -1) return { [title]: [] }
            const target = records[index]
            
            const filtered = records.filter(r => r._id !== _id)

            console.log('FILTERED RECORD', filtered)
            await fs.writeFile(
                docPath, 
                this._serialize({ [title]: filtered.length > 0 ? filtered : []}), 
                this.#UTF8
            )

           return { [title]: [target ?? []] }
            
        } catch(error) {
            throw error
        }
    }

}

const httpUtils = new HttpUtils()
module.exports = httpUtils