import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import config from '@adonisjs/core/services/config'
import Permission from '#models/permission'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Role extends BaseModel {
  static ADMIN_ROLE_ALIAS = 'ADMIN'
  static USER_ROLE_ALIAS = 'USER'

  static ADMINS_ROLE_ALIASES = [this.ADMIN_ROLE_ALIAS]

  static ROLE_ALIASES = [this.ADMIN_ROLE_ALIAS, this.USER_ROLE_ALIAS]

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string | null

  @column()
  declare alias: string

  @column()
  declare description: string | null

  @manyToMany(() => Permission)
  declare permissions: relations.ManyToMany<typeof Permission>

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toFormat(config.get('panel.dateTimes.dateTimeFormat')),
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toFormat(config.get('panel.dateTimes.dateTimeFormat')),
  })
  declare updatedAt: DateTime | null
}
