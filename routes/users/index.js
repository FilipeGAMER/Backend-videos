import usersController from '../../controllers/usersController.js'

export default async function (fastify, opts) {
  const userSchema = await usersController.geUserSchema()
  const userLoginSchema = await usersController.geUserLoginSchema()
  const queryUserSchema = await usersController.getQuery()

  fastify.get('/', {
    schema: {
      querystring: queryUserSchema
    },
    onRequest: [fastify.authenticate]
  }, usersController.getUsers)
  
  fastify.post('/', {
    schema: {
      body: userSchema
    },
    onRequest: [fastify.authenticate]
  }, usersController.addUser)


  fastify.post('/login', {
    schema: {
      body: userLoginSchema
    }
  }, usersController.login)
}
