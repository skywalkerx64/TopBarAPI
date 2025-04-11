import User from '#models/user'
import {
  changePasswordValidator,
  emailForResetValidator,
  emailVerificationValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from '#validators/auth/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import { randomInt } from 'node:crypto'
export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
    })

    const code = randomInt(1000, 9999)
    await user.merge({ verificationToken: String(code), verificationTokenExpiresAt: null }).save()

    const verificationLink =
      process.env.FRONTEND_URL +
      '/reset-password?token=' +
      user.verificationToken +
      '&email=' +
      user.email
    await mail.send((message) => {
      message
        .to(user.email)
        .subject('TopBar - Vérifiez votre adresse email')
        .htmlView('emails/auth/verification_token', { user, verificationLink })
    })

    return response.status(201).json({
      message: 'User registered',
      user: user,
    })
  }

  async login({ request }: HttpContext) {
    const data = await loginValidator.validate(request.all())

    const user = await User.verifyCredentials(data.email, data.password)
    await user.load('roles')

    const token = await User.accessTokens.create(user)

    return {
      message: 'Logged in',
      token: token.value?.release(),
      user: user.toJSON(),
    }
  }

  async logout({ auth, response }: HttpContext) {
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(auth.user, token)
    return response.ok({ message: 'Logged out' })
  }

  async changePassword({ request, auth, response }: HttpContext) {
    const data = await changePasswordValidator.validate(request.all())
    const user = await User.find(auth.user?.id)
    if (!user) return response.badRequest({ message: 'User not found' })

    if (!(await hash.verify(user.password, data.oldPassword))) {
      return response.badRequest({
        errors: [
          {
            message: 'Invalid user credentials',
          },
        ],
      })
    }

    if (!(await hash.verify(user.password, data.oldPassword))) {
      return response.badRequest({
        errors: [
          {
            message: 'Invalid user credentials',
          },
        ],
      })
    }

    await user.merge({ password: data.password }).save()

    return response.ok({ message: 'Password changed' })
  }

  async verifyEmail({ request, response }: HttpContext) {
    const data = await emailVerificationValidator.validate(request.all())

    const user = await User.findBy('email', data.email)

    if (!user) return response.badRequest({ message: 'User not found' })

    if (user.verificationToken !== data.token) {
      return response.badRequest({ message: 'Invalid verification code' })
    }
    await user
      .merge({
        verificationToken: null,
        verificationTokenExpiresAt: null,
        emailVerifiedAt: DateTime.now(),
      })
      .save()

    return response.ok({ message: 'Email verified' })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const data = await emailForResetValidator.validate(request.all())
    const user = await User.findBy('email', data.email)

    if (!user) return response.badRequest({ message: 'User not found' })

    const code = randomInt(1000000, 9999999)
    const expirationTime = DateTime.now().plus({ minutes: 30 }) // Ajouter 30 minutes

    await user
      .merge({
        verificationToken: String(code),
        verificationTokenExpiresAt: expirationTime, // Définir l'expiration du code
      })
      .save()

    const resetLink =
      process.env.FRONTEND_URL +
      '/reset-password?token=' +
      user.verificationToken +
      '&email=' +
      user.email

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('TopBar - Mot de Passe Oublié')
        .htmlView('emails/auth/reset_password', { user, code, resetLink })
    })

    return response.status(201).json({
      message: 'Code de verification envoyé avec succès.',
    })
  }

  async verifyResetCode({ request, response }: HttpContext) {
    const data = await emailVerificationValidator.validate(request.all())

    const user = await User.findBy('email', data.email)

    if (!user) return response.badRequest({ message: 'User not found' })

    if (user.verificationToken !== data.token) {
      return response.badRequest({ message: 'Invalid verification code' })
    }

    return response.ok({ message: 'Code verified' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const data = await resetPasswordValidator.validate(request.all())

    const user = await User.findBy('email', data.email)

    if (!user) return response.badRequest({ message: 'User not found' })

    if (user.verificationToken !== data.token) {
      return response.badRequest({ message: 'Invalid verification code' })
    }
    if (!user.verificationTokenExpiresAt || DateTime.now() > user.verificationTokenExpiresAt) {
      return response.badRequest({ message: 'Verification code has expired' })
    }
    await user
      .merge({
        verificationToken: null,
        verificationTokenExpiresAt: null,
        password: data.newPassword,
      })
      .save()

    return response.ok({ message: 'Password has been reset successfully' })
  }
}
