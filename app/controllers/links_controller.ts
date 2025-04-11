import type { HttpContext } from '@adonisjs/core/http'

import Link from '#models/link'
import { updateLinkValidator } from '#validators/link'

export default class LinksController {
  async index() {
    const links = await Link.all()
    return links
  }

  async update({ request, params }: HttpContext) {
    const link = await Link.findOrFail(params.id)

    const data = await request.validateUsing(updateLinkValidator)

    link.merge(data)
    await link.save()

    return link
  }

  async show({ params }: HttpContext) {
    const link = await Link.findOrFail(params.id)
    return link
  }

  async showByUrl({ params }: HttpContext) {
    const link = await Link.query().where('url', params.url).firstOrFail()
    return link
  }

  async stats({ params }: HttpContext) {
    const link = await Link.findOrFail(params.id)
    await link.load('trackings')
    const trackings = link.trackings

    return {
      clicks: trackings?.length ?? 0,
      views: trackings?.length ?? 0,
    }
  }

  async tracks({ params }: HttpContext) {
    const link = await Link.findOrFail(params.id)
    await link.load('trackings')
    const trackings = link.trackings

    return trackings
  }
}
