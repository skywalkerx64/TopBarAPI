import User from '#models/user'
import { searchUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async currentUser({ auth }: HttpContext) {
    const user = auth.user
    await user?.load('roles')
    return user?.toJSON()
  }

  async index({ request }: HttpContext) {
    return request.input('perPage')
      ? User.query().preload('roles').paginate(request.input('page'), request.input('perPage'))
      : User.query().preload('roles')
  }

  async search({ request }: HttpContext) {
    const data = await request.validateUsing(searchUserValidator)
    const perPage = data.perPage ?? 10
    const page = data.page ?? 1
    const email = data.email
    const fullName = data.fullName
    const username = data.username
    const roles = data.roles

    let users = User.query().preload('roles')
    if (email) users = users.where('email', 'like', `%${email}%`)
    if (fullName) users = users.where('full_name', 'like', `%${fullName}%`)
    if (username) users = users.where('username', 'like', `%${username}%`)
    if (roles)
      users = users.whereHas('roles', function (rolesQuery) {
        rolesQuery.whereIn('alias', roles)
      })

    return users.paginate(page, perPage)
  }
  async update({ params, request }: HttpContext) {
    const data = await request.validateUsing(updateUserValidator)
    const user = await User.findOrFail(params.id)

    await user.merge(data).save()

    await user.load('roles')
    return user
  }
}
