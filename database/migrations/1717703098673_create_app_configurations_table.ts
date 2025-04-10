import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'app_configurations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').unique()
      table.string('name').nullable()
      table.string('module').nullable()
      table.text('value').nullable()
      table.text('type').nullable()
      table.boolean('visible').defaultTo(true)
      table.text('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
