import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const roles = [
      { title: 'Administrateur', alias: Role.ADMIN_ROLE_ALIAS, description: 'Role Administrateur' },
      {
        title: 'Créateur de contenu',
        alias: Role.CONTENT_CREATOR_ROLE_ALIAS,
        description: 'Créateur de contenu',
      },
      { title: 'Utilisateur', alias: Role.CUSTOMER_ROLE_ALIAS, description: 'Utilisateur' },
    ]

    await Role.createMany(roles)
  }
}
