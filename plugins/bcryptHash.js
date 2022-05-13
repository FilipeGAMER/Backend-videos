import fp from 'fastify-plugin'
import bcrypt from 'bcrypt'

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

export default fp(async (fastify, opts) => {
  fastify.decorate('generateHash', async function(text) {
    const custoHash = 12;
    return bcrypt.hash(text, custoHash);
  })
  
  fastify.decorate('compareHash', async function(text, hash) {
    return bcrypt.compare(text, hash);
  })
})
