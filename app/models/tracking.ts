import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Link from '#models/link'

export default class Tracking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare linkId: string | null

  @column()
  declare ip: string | null

  @column()
  declare url: string | null

  @belongsTo(() => Link)
  declare link: relations.BelongsTo<typeof Link>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
