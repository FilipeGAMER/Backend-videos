import videosController from '../../controllers/videosController.js'

export default async function (fastify, opts) {
  const videoSchema = await videosController.geNewVideoSchema()
  const updateVideoSchema = await videosController.geUpdateVideoSchema()
  const queryVideoSchema = await videosController.getQuery()

  fastify.get('/', {
    schema: {
      querystring: queryVideoSchema
    },
    onRequest: [fastify.authenticate]
  }, videosController.getVideos)
  
  fastify.get('/:id', {
    onRequest: [fastify.authenticate]
  }, videosController.getVideoById)

  fastify.put('/:id', {
    schema: {
      body: updateVideoSchema
    },
    onRequest: [fastify.authenticate]
  }, videosController.updateVideo)

  fastify.post('/', {
    schema: {
      body: videoSchema
    },
    onRequest: [fastify.authenticate]
  }, videosController.addVideo)

  fastify.delete('/:id', {
    onRequest: [fastify.authenticate]
  }, videosController.deleteVideo)

  fastify.get('/free', videosController.getVideosFree)
}
