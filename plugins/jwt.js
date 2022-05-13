import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

//node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"

export default fp(async (fastify, opts) => {
  fastify.decorate('createJWT', async function(payload) {
    return jwt.sign(payload, process.env.TOKEN_JWT, { expiresIn: '15m'});
  })
  
  fastify.decorate('verifyJWT', async function(token) {
    return jwt.verify(token, process.env.TOKEN_JWT)
  })

  fastify.decorate("authenticate", async function(request, reply) {
    try {
      let token = request.headers['authorization']
      if (!token) {
        return reply.unauthorized()
      }
      if (token.indexOf('Bearer ') > -1) {
        token = token.split("Bearer ")[1]
      }
      const payload = await this.verifyJWT(token)
      // console.log(">>>>>>>>> payload", payload)
      if (!payload && !payload.id) {
        return reply.unauthorized()
      }

      request.token = token
      request.id = payload.id
      return request
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return reply.unauthorized(err.message)
      }
      return reply.send(err)
    }
  })
})
