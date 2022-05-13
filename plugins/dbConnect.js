import fp from 'fastify-plugin'
import mongoose from "mongoose"


// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

export default fp(async (fastify, opts) => {

  const LIMIT = process.env.DB_RETURN_LIMIT || 5
  const DB_USER = process.env.DB_USER || 'test'
  const DB_PASSWD = process.env.DB_PASSWD || 'testpass'
  const DB_PATH = process.env.DB_PATH || 'test.videos.mongodb/TesteVideosDatabase'

  let dbUrl = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${DB_PATH}`
  let mongod


  if (opts.test || DB_USER == 'test') {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    mongod = await MongoMemoryServer.create();
    dbUrl = await mongod.getUri();
  }

  fastify.decorate('dbReturnLimit', () => {
    return LIMIT
  })

  await mongoose.connect(dbUrl, { 
    useNewUrlParser: true 
  }).then((db) => {
    fastify.log.info('Database conection was a success!')
   
    fastify.decorate('mongoose', db)

    fastify.addHook('onClose', async (fastify) => {
      await fastify.mongoose.connection.close()
      if (mongod) {
        await mongod.stop()
      }
    })

  }).catch((err) => {
    fastify.log.error(err)
    process.exit(1)
  })
})
