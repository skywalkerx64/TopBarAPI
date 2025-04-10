import vine from '@vinejs/vine'
import { uniqueRule } from '../rules/unique.js'
/**
 * Validates the role's creation action
 */
export const storePermissionValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'permissions', column: 'title' })),
    module: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
  })
)

export const updatePermissionValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'permissions', column: 'title', exceptCurrent: true }))
      .optional(),
    module: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const searchPermissionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    module: vine.string().trim().optional(),
    perPage: vine.number().min(1).optional(),
    page: vine.number().min(1).optional(),
  })
)
