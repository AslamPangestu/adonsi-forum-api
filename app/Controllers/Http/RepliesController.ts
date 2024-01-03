import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Thread from 'App/Models/Thread'
import ReplyValidator from 'App/Validators/ReplyValidator'

export default class RepliesController {
  public async store({ request, auth, response, params }: HttpContextContract) {
    try {
      const { content } = await request.validate(ReplyValidator)
      const thread = await Thread.findOrFail(params.thread_id)

      const reply = await thread.related('replies').create({
        userId: auth.user?.id,
        content,
      })
      return response.status(201).json({ data: reply, message: 'Create Thread Reply Success' })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }
  }
}
