import User from "../models/User.js"

const options = await User.options()

class UsersController {
  static async geUserSchema () {
    return User.geUserSchema()
  }

  static async geUserLoginSchema () {
    return User.geUserLoginSchema()
  }

  static async getQuery () {
    return User.getQuery()
  }

  static async getUsers (request, reply) {
    try {
      const { page = 0 } = request.query;

      const users = await User.find({}, options).skip(page * this.dbReturnLimit()).limit(this.dbReturnLimit())
      if (users.length === 0) {
        return reply.notFound()
      }
      
      return reply.code(200).send(users)
    } catch (err) {
      throw err
    }
  }

  static async addUser (request, reply) {
    try {
      this.validateObj(request.body)

      const body = {...request.body}
      body.password = await this.generateHash(request.body.password)

      const user = new User(body)

      await User.create(user)

      return reply.code(201).send()
    } catch (err) {
      if (err.message.indexOf('E11000') > -1) {
        return reply.badRequest(`Email already in database`)
      }
      throw err
    }
  }

  static async login (request, reply) {
    try {
      const { email, password } = request.body
      const user = await User.findOne({ email: email })
      if (!user) {
        return reply.badRequest('Invalid e-mail or password')
      }
  
      const verified = await this.compareHash(password, user.password)
      if (!verified) {
        return reply.badRequest('Invalid e-mail or password')
      }

      const payload = {
        id: user._id
      }
      const token = await this.createJWT(payload)

      return reply.code(204).header("Authorization", token).send()
    } catch (err) {
      throw err
    }
  }

}

export default UsersController
