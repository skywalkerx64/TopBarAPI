import Role from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const roles = await Role.all()
    const users = [
      {
        data: {
          email: 'johndoe@mail.test',
          password: 'password',
          fullName: 'John Doe',
          username: 'superAdmin',
        },
        roles: [Role.ADMIN_ROLE_ALIAS, Role.USER_ROLE_ALIAS],
      },
    ]

    for (const user of users) {
      const newUser = await User.create(user.data)

      await newUser.merge({ emailVerifiedAt: DateTime.now() }).save()

      const roleIds = roles.filter((role) => user.roles.includes(role.alias)).map((role) => role.id)

      await newUser.related('roles').sync(roleIds)
    }
  }
}
