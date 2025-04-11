import Tracking from '#models/tracking'
import type { HttpContext } from '@adonisjs/core/http'

export default class TrackingsController {
  async track({ request, params }: HttpContext) {
    const ip = request.ip()
    const linkId = params.id

    // Here you would typically save the tracking information to a database
    await Tracking.create({ linkId: linkId, ip })

    return {
      message: 'Tracking information saved successfully',
      linkId,
      ip,
    }
  }
}
