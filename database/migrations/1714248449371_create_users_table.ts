import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('username').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('otp').nullable()

      table.dateTime('email_verified_at').nullable()

      table.string('verification_token').nullable()
      table.dateTime('verification_token_expires_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
