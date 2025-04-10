import Role from '#models/role'
import { searchRoleValidator, storeRoleValidator, updateRoleValidator } from '#validators/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  async index({ request }: HttpContext) {
    return request.input('perPage')
      ? Role.query().paginate(request.input('page'), request.input('perPage'))
      : Role.all()
  }

  async search({ request }: HttpContext) {
    const data = await searchRoleValidator.validate(request.all())
    const perPage = data.perPage ?? 10
    const page = request.input('page') ?? 1
    const title = request.input('title')
    const alias = request.input('alias')
    const description = request.input('description')

    let roles = Role.query()

    if (title) roles = roles.where('title', 'ilike', `%${title}%`)

    if (alias) roles = roles.where('alias', alias)

    if (description) roles = roles.where('description', 'ilike', `%${description}%`)

    return roles.paginate(page, perPage)
  }
  async show({ params }: HttpContext) {
    return Role.findOrFail(params.id)
  }

  async store({ request }: HttpContext) {
    const data = await storeRoleValidator.validate(request.all())

    return await Role.create(data)
  }

  async update({ params, request }: HttpContext) {
    const data = await updateRoleValidator.validate({
      id: params.id,
      ...request.all(),
    })
    const role = await Role.findOrFail(params.id)
    return await role.merge(data).save()
  }

  async destroy({ params }: HttpContext) {
    const role = await Role.findOrFail(params.id)
    return await role.delete()
  }
}
