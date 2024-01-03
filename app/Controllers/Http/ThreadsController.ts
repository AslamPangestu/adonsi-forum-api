import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizeExecptionException from 'App/Exceptions/UnauthorizeExecptionException'
import Thread from 'App/Models/Thread'
import SortThreadValidator from 'App/Validators/SortThreadValidator'
import ThreadValidator from 'App/Validators/ThreadValidator'

export default class ThreadsController {
  public async index({ response, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const userId = request.input('user_id')
    const categoryId = request.input('category_id')
    const title = request.input('title')

    const sortValidator = await request.validate(SortThreadValidator)
    try {
      const sortBy = sortValidator.sort_by || 'id'
      const order = sortValidator.order || 'asc'
      const thread = await Thread.query()
        .if(userId, (query) => query.where('user_id', userId))
        .if(categoryId, (query) => query.where('category_id', categoryId))
        .if(title, (query) => query.whereILike('title', `%${title}%`))
        .orderBy(sortBy, order)
        .preload('category')
        .preload('user')
        .paginate(page, limit)
      return response.status(200).json({ data: thread, message: 'Get Thread Success' })
    } catch (error) {
      return response.status(404).json({ message: error.messages })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const validate = await request.validate(ThreadValidator)
    try {
      const thread = await auth.user?.related('threads').create(validate)
      await thread?.load('user')
      await thread?.load('category')
      return response.status(201).json({ data: thread, message: 'Create Thread Success' })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const thread = await Thread.query()
        .where('id', params.id)
        .preload('category')
        .preload('user')
        .preload('replies')
        .firstOrFail()
      return response.status(200).json({ data: thread, message: 'Get Current Thread Success' })
    } catch (error) {
      if (error.name === 'ModelNotFoundExecption') {
        return response.status(404).json({ message: 'Thread Not Found' })
      }
      return response.status(500).json({ message: error.messages })
    }
  }

  public async update({ request, params, auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      const validate = await request.validate(ThreadValidator)
      const thread = await Thread.findOrFail(params.id)
      if (user?.id !== thread.userId) {
        throw new UnauthorizeExecptionException()
      }
      await thread?.merge(validate).save()

      await thread?.load('user')
      await thread?.load('category')

      return response.status(200).json({ data: thread, message: 'Update Current Thread Success' })
    } catch (error) {
      if (error.name === 'UnauthorizeExecption') {
        return response.status(error.status).json({ message: error.message })
      }
      if (error.name === 'ModelNotFoundExecption') {
        return response.status(404).json({ message: 'Thread Not Found' })
      }
      return response.status(500).json({ message: error.messages })
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.user
      const thread = await Thread.findOrFail(params.id)
      if (user?.id !== thread.userId) {
        throw new UnauthorizeExecptionException()
      }
      await thread.delete()
      return response.status(200).json({ data: thread, message: 'Delete Current Thread Success' })
    } catch (error) {
      if (error.name === 'UnauthorizeExecption') {
        return response.status(error.status).json({ message: error.message })
      }
      if (error.name === 'ModelNotFoundExecption') {
        return response.status(404).json({ message: 'Thread Not Found' })
      }
      return response.status(500).json({ message: error.messages })
    }
  }
}
