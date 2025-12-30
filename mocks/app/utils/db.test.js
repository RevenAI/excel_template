const path = require('node:path')
const fs = require('node:fs/promises')

class DbUtils {
    #UTF8 = 'utf8'

    async readJsonDoc(docPath, _id) {
        this._validatePath(docPath)
            const title = this._createDocTitleFromDir(docPath)
            try {
                this._ensureFileDir(docPath)
                const raw = await fs.readFile(docPath)
                const parsed = this._parseJson(raw)
                const records = parsed[title]

                if (_id) {
                    const index = records.findIndex(rc => rc._id === _id)
                    if (index === -1) return { [title]: [] }

                    return { [title]: [records[index]] }
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
        this._validatePath(docPath)
        if (!data || (typeof data !== 'object' || Array.isArray(data))) {
            throw new Error('Invalid data. Expected object {} format')
        }
        const title = this._createDocTitleFromDir(docPath)

        try {
            this._ensureFileDir(docPath)
            const existing = await this.readJsonDoc(docPath)
            const records = existing[title] || []

            //flags
            const isCreating = !data?._id
            let newRec, index
            let newUserId = null

            //create POST
            if (isCreating) {
                newUserId = `id-${Date.now()}`
                newRec = {
                    _id: newUserId,
                    ...data,
                }
                records.push(newRec)
            } else {
                index = records.findIndex(rc => rc._id === data?._id)
                if (index === -1) return { [title]: [] }

                const { _id, ...safeUpdates } = data //ensure data integrity
                records[index] = {
                    ...records[index],
                    ...safeUpdates,
                }
            }
            const result = { [title]: records }

            await fs.writeFile(docPath, this._serializeObj(result), this.#UTF8)

            return isCreating
                         ? { [title]: [newRec] } : 
                                    { [title]: [result[title][index]] }
        } catch(error) {
            throw error
        }
    }

    async deleteById(docPath, _id) {
        this._validatePath(docPath)
        if (!_id) throw new Error('Document ID required')
            const title = this._createDocTitleFromDir(docPath)

        try {
            const existing = await this.readJsonDoc(docPath)
            const records = existing[title]

            const index = records.findIndex(rc => rc._id === _id)
            if (index === -1) return { [title]: [] }
            const target = records[index]

            const filtered = records.filter(rc => rc._id !== _id)

            await fs.writeFile(docPath, this._serializeObj({
                [title]: filtered
            }), this.#UTF8)

            return { [title]: [target] }
        } catch(error) {
            throw error
        }
    }


    //private and protected methods
    _validatePath(docPath) {
        if (!docPath) throw new Error('Document path required')
    }
    _parseJson = (data) => JSON.parse(data)
    _serializeObj = (data) => JSON.stringify(data, null, 2)
    _createDocTitleFromDir = (docPath) => path.basename(path.dirname(docPath))
    async _ensureFileDir(docPath) {
        this._validatePath(docPath)
         const dir = path.dirname(docPath)
        try {
            await fs.access(dir, fs.constants.F_OK)
        } catch {
            await fs.mkdir(dir, { recursive: true })
        }
    }
 

}

const dbUtils = new DbUtils()
module.exports = dbUtils