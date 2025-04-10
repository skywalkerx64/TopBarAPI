import Permission from '#models/permission'
import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const permissions = [
      ...(await this.parsePermission(
        'role',
        ['access', 'create', 'update', 'delete'],
        [Role.ADMIN_ROLE_ALIAS]
      )),
      ...(await this.parsePermission(
        'user',
        ['access', 'create', 'update', 'delete'],
        [Role.ADMIN_ROLE_ALIAS]
      )),
    ]

    await Permission.createMany(permissions)
  }

  async parsePermission(resource: string, actions: string[], roles: string[]) {
    return actions.map((action) => ({
      title: `${resource}_${action}`,
      module: resource,
      description: `${resource} ${action} permission`,
      defaultRoles: JSON.stringify(roles),
    }))
  }
}
