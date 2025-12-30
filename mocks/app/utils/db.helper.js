const fs = require('node:fs').promises
const path = require('node:path')

class DbTools {

    #UTF8 = 'utf8'
    #NO_DOC_ERR = 'ENOENT'

    _isDevMode = process.env.NODE_ENV === 'development'

    constructor() {}

    _logError(error) {
        if (this._isDevMode) {
            console.error('[DB ERROR]', error.message)
        }
    }

    _serialize(data) {
        return JSON.stringify(data, null, 2)
    }

    _parse(data) {
        return JSON.parse(data)
    }

    // ============================
    // PUBLIC METHODS
    // ============================

    async readJsonDoc(docPath, _id) {
       this._validateDocID(docPath)
       this._validateDocID(_id)

        try {
            const raw = await fs.readFile(docPath, this.#UTF8)
            const title = this._extractTitle(docPath)

            if (!raw.trim()) {
                return { [title]: [] }
            }

            const parsed = this._parse(raw)
            const records = parsed[title] ?? []

           // let result = {}
            if (_id) {
                const record = records.find(r => r._id === _id)
                return { [title]: record ? [record] : [] }
            }
            
            return records

        } catch (error) {
            if (error.code === this.#NO_DOC_ERR) {
                const title = this._extractTitle(docPath)
                return { [title]: [] }
            }
            this._logError(error)
            throw error
        }
    }

    async upsertJsonDoc(docPath, data) {
        this._validateDocPath(docPath)
        this._validateData(data)

        await this._ensureDirExists(docPath)

        const title = this._extractTitle(docPath)
        const existing = await this.readJsonDoc(docPath)
        const records = existing[title] ?? []

        // CREATE (POST)
        if (!data?._id) {
            const newRecord = {
                _id: `id-${Date.now()}`,
                ...data
            }

            records.push(newRecord)
        }
        // UPDATE (PUT)
        else {
            const index = records.findIndex(r => r._id === data._id)

            if (index === -1) {
                return { [title]: [] }
            }

            //LOCK _id: remove it from client updates
            const { _id, ...safeUpdates } = data

            records[index] = {
                ...records[index], // keeps original _id
                ...safeUpdates     // apply allowed updates only
            }
        }

        const result = { [title]: records }

        await fs.writeFile(
            docPath,
            this._serialize(result),
            this.#UTF8
        )

        return result
    }

    async deleteById(docPath, _id) {
        this._validateDocID(docPath)
        this._validateDocID(_id)

        const title = this._extractTitle(docPath)
        const existing = await this.readJsonDoc(docPath)
        const records = existing[title] ?? []

        const filtered = records.filter(r => r._id !== _id)

        if (filtered.length === records.length) return existing

        const result = { [title]: filtered }

        await fs.writeFile(
            docPath,
            this._serialize(result),
            this.#UTF8
        )

        return result
    }


    // ============================
    // PRIVATE / PROTECTED METHODS
    // ============================

    _validateDocID(_id) {
    if (_id && (typeof _id !== 'string' || _id.length > 150)) {
        throw new Error('Invalid document ID')
    }
    }

    _validateDocPath(docPath) {
        if (!docPath) throw new Error('Document path is required')
    }

    _validateData(data) {
        if (!data || typeof data !== 'object') {
        throw new Error('Invalid data')
        }
    }

    _extractTitle(docPath) {
        return path.basename(docPath, '.json')
    }

    async _ensureDirExists(docPath) {
        const dir = path.dirname(docPath)
        try {
            await fs.access(dir)
        } catch {
            await fs.mkdir(dir, { recursive: true })
        }
    }


}

const dbTools = new DbTools()

module.exports = { dbTools }
