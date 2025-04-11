import Link from '#models/link'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const links = [
      {
        id: 1,
        message: '🌐 Ouvrez dans votre navigateur pour une meilleure expérience',
        url: 'https://top-bar.vercel.app/',
        gifUrl: 'https://data.textstudio.com/output/sample/animated/3/2/6/5/public-1-5623.gif',
        backgroundColor: '#1E293B',
        textColor: '#FFFFFF',
      },
    ]

    await Promise.all(
      links.map(async (link) => {
        await Link.create(link)
      })
    )
  }
}
