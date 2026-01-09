import fs from 'node:fs/promises'

class Helpers {

public async createDirIfNotExists(dir: string) {
  try {
    await fs.access(dir, fs.constants.F_OK);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

}

export default new Helpers()