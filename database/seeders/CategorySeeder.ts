import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import CategoryModel from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run() {
    await CategoryModel.createMany([
      { title: 'Food' },
      { title: 'Travel' },
      { title: 'Entertaiment' },
      { title: 'Games' },
      { title: 'Technology' },
    ])
  }
}
