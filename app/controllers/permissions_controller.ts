import Permission from '#models/permission'
import {
  searchPermissionValidator,
  storePermissionValidator,
  updatePermissionValidator,
} from '#validators/permission'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermissionsController {
  async index({ request }: HttpContext) {
    return request.input('perPage')
      ? Permission.query().paginate(request.input('page'), request.input('perPage'))
      : Permission.all()
  }

  async search({ request }: HttpContext) {
    const data = await searchPermissionValidator.validate(request.all())
    const perPage = data.perPage ?? 10
    const page = request.input('page') ?? 1
    const title = request.input('title')
    const perissionModule = request.input('module')
    const description = request.input('description')

    let permission = Permission.query().orderBy('created_at', 'desc')

    if (title) permission = permission.where('title', title)

    if (perissionModule) permission = permission.where('module', 'ilike', `%${perissionModule}%`)

    if (description) permission = permission.where('description', 'ilike', `%${description}%`)

    return permission.paginate(page, perPage)
  }
  async show({ params }: HttpContext) {
    return Permission.findOrFail(params.id)
  }

  async store({ request }: HttpContext) {
    const data = await storePermissionValidator.validate(request.all())

    return await Permission.create(data)
  }

  async update({ params, request }: HttpContext) {
    const data = await updatePermissionValidator.validate({
      id: params.id,
      ...request.all(),
    })
    const permission = await Permission.findOrFail(params.id)
    return await permission.merge(data).save()
  }

  async destroy({ params }: HttpContext) {
    const permission = await Permission.findOrFail(params.id)
    return await permission.delete()
  }
}
