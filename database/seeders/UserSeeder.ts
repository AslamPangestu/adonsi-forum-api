import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'User 1',
        email: 'email1@mail.com',
        password: 'password',
      },
    ])
  }
}
