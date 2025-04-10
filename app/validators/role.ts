import vine from '@vinejs/vine'
import { uniqueRule } from '../rules/unique.js'
import { existsRule } from '../rules/exists.js'
/**
 * Validates the role's creation action
 */
export const storeRoleValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'roles', column: 'title' })),
    alias: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'roles', column: 'alias' })),
    description: vine.string().trim().optional(),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'roles', column: 'title', exceptCurrent: true }))
      .optional(),
    alias: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'roles', column: 'alias', exceptCurrent: true }))
      .optional(),
    description: vine.string().trim().optional(),
  })
)

export const searchRoleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    alias: vine
      .string()
      .trim()
      .use(existsRule({ table: 'roles', column: 'alias' }))
      .optional(),
    description: vine.string().trim().optional(),
    perPage: vine.number().min(1).optional(),
    page: vine.number().min(1).optional(),
  })
)
