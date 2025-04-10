import type { HttpContext } from '@adonisjs/core/http'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'

export default class MediaController {
  PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

  async serve({ request, response }: HttpContext) {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (this.PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('storage/uploads', normalizedPath)
    return response.download(absolutePath)
  }
}
