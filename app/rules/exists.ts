import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the exists rule
 */
type ExistsRuleOptions = {
  table: string
  column: string
}

/**
 * Implementation
 */
async function exists(value: any, options: ExistsRuleOptions, field: FieldContext) {
  const row = await db.query().from(options.table).where(options.column, value).first()
  if (!row) {
    field.report('The {{ field }} field is not valid', 'valid', field)
  }
}
/**
 * Converting the main function to a VineJS rule
 */
export const existsRule = vine.createRule(exists)
