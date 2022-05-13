import categoriesController from '../../controllers/categoriesController.js'
import videosController from '../../controllers/videosController.js'

export default async function (fastify, opts) {
  const categoriaSchema = await categoriesController.getNewCategorySchema()
  const updateCategorySchema = await categoriesController.getUpdateCategorySchema()
  const pageQueryVideoSchema = await videosController.getPageQuery()

  fastify.get('/', {
    onRequest: [fastify.authenticate]
  }, categoriesController.getCategory)

  fastify.get('/:id', {
    onRequest: [fastify.authenticate]
  }, categoriesController.getCategoryById)

  fastify.get('/:id/videos', {
    schema: {
      querystring: pageQueryVideoSchema
    },
    onRequest: [fastify.authenticate]
  }, videosController.getVideosByCategory)

  fastify.put('/:id', {
    schema: {
      body: updateCategorySchema
    },
    onRequest: [fastify.authenticate]
  }, categoriesController.updateCategory)

  fastify.post('/', {
    schema: {
      body: categoriaSchema
    },
    onRequest: [fastify.authenticate]
  }, categoriesController.addCategory)

  fastify.delete('/:id', {
    onRequest: [fastify.authenticate]
  }, categoriesController.deleteCategory)
}
