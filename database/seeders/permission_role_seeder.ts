import Permission from '#models/permission'
import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const roles = await Role.all()
    roles.forEach(async (role) => {
      const permissions = await this.getPermissions(role)
      if (permissions.length > 0)
        await db.table('permission_role').multiInsert(await this.getPermissions(role))
    })
  }

  async getPermissions(role: Role) {
    let permissions = await Permission.query()
      .where('defaultRoles', 'ilike', `%${role.alias}%`)
      .select('title', 'id')

    return permissions.map((permission) => {
      return {
        permission_id: permission.id,
        role_id: role.id,
      }
    })
  }
}
