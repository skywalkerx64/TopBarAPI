import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Tracking from '#models/tracking'

export default class Link extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string

  @column()
  declare message: string

  @column()
  declare gifUrl: string

  @column()
  declare backgroundColor: string

  @column()
  declare textColor: string

  @hasMany(() => Tracking)
  declare trackings: relations.HasMany<typeof Tracking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
