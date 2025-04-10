import vine from '@vinejs/vine'
import { existsRule } from '../rules/exists.js'
import { uniqueRule } from '../rules/unique.js'
import Role from '#models/role'
/**
 * Validates the role's creation action
 */

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().optional(),
    fullName: vine.string().trim().optional(),
    username: vine.string().trim().optional(),
  })
)

export const storeUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().confirmed({ confirmationField: 'passwordConfirmation' }).trim(),
  })
)
export const searchUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().optional(),
    fullName: vine.string().trim().optional(),
    username: vine.string().trim().optional(),
    roles: vine.array(vine.string().in(Role.ROLE_ALIASES).trim()).optional(),
    userId: vine
      .number()
      .optional()
      .use(existsRule({ table: 'users', column: 'id' })),
    perPage: vine.number().min(1).optional(),
    page: vine.number().min(1).optional(),
  })
)
