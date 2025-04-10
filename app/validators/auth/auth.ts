import vine from '@vinejs/vine'
import { uniqueRule } from '../../rules/unique.js'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().trim(),
  })
)
export const changePasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string().trim(),
    password: vine.string().confirmed().notSameAs('old_password').trim(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    username: vine.string().trim(),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().confirmed({ confirmationField: 'passwordConfirmation' }).trim(),
  })
)

export const emailVerificationValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    email: vine.string().trim(),
  })
)

export const emailForResetValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    token: vine.string().trim(),
    newPassword: vine.string().trim(),
  })
)
