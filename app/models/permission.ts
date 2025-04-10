import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import config from '@adonisjs/core/services/config'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare module: string | null

  @column()
  declare description: string | null

  @column()
  declare isActive: boolean

  @column({ serializeAs: null })
  declare defaultRoles: string | null

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
