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
const TrackingsController = () => import('#controllers/trackings_controller')
const LinksController = () => import('#controllers/links_controller')

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
  .group(() => {
    router.get('links', [LinksController, 'index']).as('links.index')
    router.get('links/:id', [LinksController, 'show']).as('links.show')
    router.get('links/url/:url', [LinksController, 'showByUrl']).as('links.show-by-url')
    router.put('links/:id', [LinksController, 'update']).as('links.update')
    router.post('track/link/:id', [TrackingsController, 'track']).as('links.track')
    router.get('links/:id/stats', [LinksController, 'stats']).as('links.stats')
    router.get('links/tracks/:id', [LinksController, 'tracks']).as('links.tracks')
  })
  .prefix('api')
  .as('api')
