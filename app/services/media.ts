import env from '#start/env'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class MediaService {
  static async upload(file: any, filePath: string = MEDIA_PATH) {
    await file!.move(app.makePath(filePath), {
      name: `${cuid()}.${file!.extname}`,
    })
    return file
  }
  static async parseUrl(fileName: string) {
    const url = env.get('APP_URL') + '/storage/' + fileName
    return url
  }

  static async unparseUrl(url: string) {
    const fileName = url.split('/').pop()
    return fileName
  }
  static async delete(fileName: string) {
    const filePath = app.makePath(MEDIA_PATH, fileName)
    try {
      await import('node:fs/promises').then(({ unlink }) => unlink(filePath))
    } catch (error) {
      console.error('Error deleting file', error)
    }
  }
}

export const MEDIA_PATH = 'storage/uploads'
