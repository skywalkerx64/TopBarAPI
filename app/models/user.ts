import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose, Secret } from '@adonisjs/core/helpers'
import * as relations from '@adonisjs/lucid/types/relations'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from '#models/role'
import config from '@adonisjs/core/services/config'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare username: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare verificationToken: string | null

  @column({ serializeAs: null })
  declare verificationTokenExpiresAt: DateTime | null

  @column({ serializeAs: null })
  declare emailVerifiedAt: DateTime | null

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

  @manyToMany(() => Role)
  declare roles: relations.ManyToMany<typeof Role>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  static async getByToken(token: string) {
    const accessToken = await User.accessTokens.verify(new Secret(token))
    if (accessToken) {
      const user = await User.find(accessToken?.tokenableId)
      return user
    }
    return false
  }

  async hasRole(roleAlias: string) {
    await this.load('roles')
    return this.roles?.map((role) => role.alias).includes(roleAlias)
  }

  async hasStrictRoles(roleAliases: Array<string>) {
    await this.load('roles')
    const userRoleAliases = this.roles?.map((role) => role.alias)
    let hasRole = true
    for (const roleAlias of roleAliases) {
      if (!userRoleAliases.includes(roleAlias)) {
        hasRole = false
        break
      }
    }
    return hasRole
  }

  async hasRoles(roleAliases: Array<string>) {
    await this.load('roles')
    const userRoleAliases = this.roles?.map((role) => role.alias)
    let hasRole = false
    for (const roleAlias of roleAliases) {
      if (userRoleAliases.includes(roleAlias)) {
        hasRole = true
        break
      }
    }
    return hasRole
  }
}
