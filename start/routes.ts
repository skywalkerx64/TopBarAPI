/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const MediaController = () => import('#controllers/media_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

//Base
router.get('/', async () => {
  return 'TopBar API'
})

router.get('storage/*', [MediaController, 'serve']).as('medias.serve')

//Auth and Confs
router
  .group(() => {
    router.post('login', [AuthController, 'login']).as('login')
    router.post('register', [AuthController, 'register']).as('register')
    router.post('email/verify', [AuthController, 'verifyEmail']).as('email.verify')

    router.post('forgot-password', [AuthController, 'forgotPassword']).as('forgot-password')
    router.post('verify-code', [AuthController, 'verifyResetCode']).as('verify-code')
    router.post('reset-password', [AuthController, 'resetPassword']).as('reset-password')
  })
  .prefix('api')
  .as('api')

//Main App Routes (Protected)
router
  .group(() => {
    router.delete('logout', [AuthController, 'logout']).as('logout')

    router.get('users/current', [UsersController, 'currentUser']).as('users.current')
  })
  .prefix('api')
  .use(middleware.auth())
  .as('api')

//Main App Routes (Not Protected)
router
  .group(() => {})
  .prefix('api')
  .as('api')
