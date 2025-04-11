import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const roles = [
      { title: 'Administrateur', alias: Role.ADMIN_ROLE_ALIAS, description: 'Role Administrateur' },

      { title: 'Utilisateur', alias: Role.USER_ROLE_ALIAS, description: 'Utilisateur' },
    ]

    await Role.createMany(roles)
  }
}
