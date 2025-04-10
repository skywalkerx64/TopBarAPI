import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type UniqueRuleOptions = {
  table: string
  column: string
  exceptCurrent?: boolean
}

/**
 * Implementation
 */
async function unique(value: any, options: UniqueRuleOptions, field: FieldContext) {
  let row = db.query().from(options.table)

  if (options.exceptCurrent) {
    row = row.whereNot('id', field.data.id)
  }
  row = await row.where(options.column, value).first()

  if (row !== null) {
    field.report('The {{ field }} field already exists', 'unique', field)
  }
}
/**
 * Converting the main function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique)
