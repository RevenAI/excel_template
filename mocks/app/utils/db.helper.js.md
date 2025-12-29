const fs = require('node:fs').promises
const path = require('node:path')



class DbTools {

    //re-usable and readonly constant
    #UTF8
    #NO_DOC_ERR
    #DUPLICATE_PATH_ERR

    //log controls
    _isDevMode
    #isLogOn

    cnstructor() {
        this.#DUPLICATE_PATH_ERR = 'EEXITS'
        this.#NO_DOC_ERR = 'ENOENT'
        this.#UTF8 = 'utf8'
        this.isLogOn = true
        this._isDevMode = process.env.NODE_ENV === 'development'
    }

    _logger(message) {
        if (this._isDevMode && this.#isLogOn) {
            console.log('SYSTEM ERRORS', message)
        }
        return
    }

    async readJsonDoc(docPath) {
        if (!docPath) throw new Error('Document path is required')
        try {
            const doc = await fs.readFile(docPath, this.#UTF8)
            const title = this._extractDocTitleFromPath(docPath) // e.g., users
            if (!doc) return { [title]: [] }
            return JSON.parse(doc)
        } catch(error) {
            if (error.code === this.#NO_DOC_ERR) {
                const title = this._extractDocTitleFromPath(docPath)
                return { [title]: [] }
            }
            this._logger(error)
            throw error
        }
    }

    async writeToJsonDoc(docPath, data) {
        try {
            if (!docPath) throw new Error('Document path is required')
                //explicit object expected {} not even []
            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                throw new Error('Invalid data format. Object format required')
            }
            await this._createDirIfNotExist(docPath)

            const existing = await this.readJsonDoc(docPath)

            console.log('EXISTING', existing)

            const title = this._extractDocTitleFromPath(docPath) //e.g., users

            console.log('TITLE', title)

            let normalized = existing[title]

            console.log('NORMALIZED', normalized)
           //handle create and update cases
           const isCreating = (data) => !!data?._id

           if (isCreating) {
            const hasId = Object.keys(data).includes('_id')
                   //efficient db query needs consistent id
            //no _id during creation
           if (!hasId) {
              normalized.push({ _id: `unique-${new Date()}`, ...data })
           }

           //_id is availble but has no value - rare but possible
           if (hasId && (data['_id'] === undefined || data['_id'] === null)) {
              normalized.push({ _id: `unique-${new Date()}`, ...data })
           }

            normalized.push({ _id: `unique-${new Date()}`, ...data })

           }

           //update cases
           if (!isCreating(data)) {
            const existing = await this.readJsonDoc(docPath)
            const normalized = existing[title]

            const target = normalized.find(n => n._id === data?._id)
            if (!target) return normalized
            const updates = { ...target, data } //lock _id
            normalized.push(updates)
           }

            await fs.writeFile(docPath, JSON.stringify({ [title]: normalized }, null, 2))
            const writes = await this.readJsonDoc(docPath) //refresh data
            console.log('CREATED DATA', writes)
            return writes
        } catch(error) {
            this._logger(error)
            throw error
        }
    }


    //CRUD OPERATIONS TOOLS
    async fetchAll(docPath) {
        return await this.readDocFile(docPath)
    }

    async fetchById(docPath, id) {
        if (!id) throw new Error('Document ID is required')
        if (typeof id !== 'number') throw new Error('Invalid ID provided') //ensure consistencies for query indexing
        const found = await this.readJsonDoc(docPath)
        const foundList = Array.isArray(found) ? found : [found]
        return foundList.find(f => f.id === id) ?? null
    }

    async create(docPath, data) {
        await this.writeToJsonDoc(docPath, JSON.stringify(data, null, 2))
        const created = await this.fetchAll(docPath)
        return JSON.parse(created || [])
    }

 

//====================================================================
//  PRIVATE METHODS
//====================================================================
    //private methods
  
//====================================================================
//  PROTECTED METHODS
//====================================================================
  _extractDocTitleFromPath(docPath) {
        if (typeof docPath !== 'string') throw new Error('Invalid document path provided')
        return path.basename(path.dirname(docPath))
    }

     async _isDirExists(docPath) {
        try {
            await fs.access(docPath, fs.constants.F_OK)
            return true
        } catch(error) {
            if (error.code === this.#NO_DOC_ERR) {
                console.log('No file erros:', error)
              return false
            }
            throw error
        }
     }

     async _createDirIfNotExist(docPath) {
        try {
            const dir = path.dirname(docPath)
            if (await this._isDirExists(dir)) {
                await fs.mkdir(dir, { recursive: true })
                return
            } else {
                return
            }
        } catch(error) {
            if (error.code === this.#DUPLICATE_PATH_ERR) {
                throw new Error(`${dir} already exist and in use`)
            }
            throw error //re-throw other errors
        }
     }

}

const dbTools = new DbTools()
module.exports = {
    dbTools
}