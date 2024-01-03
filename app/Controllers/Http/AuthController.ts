import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      const validator = await request.validate(RegisterValidator)

      const user = await User.create(validator)

      const token = await auth.login(user)
      return response.status(201).json({
        user,
        token,
      })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.all()
    try {
      const token = await auth.attempt(email, password)
      return response.status(200).json({ token: token.token, user: token.user })
    } catch (error) {
      return response.status(401).json({ message: error.messages })
    }
  }
}
