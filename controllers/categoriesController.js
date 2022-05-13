import Category from "../models/Category.js"

const options = await Category.options()

class CategoriesController {

  static async getNewCategorySchema () {

    return Category.getCategorySchema(true)
  }

  static async getUpdateCategorySchema () {

    return Category.getCategorySchema(false, true)
  }


  static async getCategory (request, reply) {
    try {
      const { page = 0 } = request.query;

      const categories = await Category.find({}, options).skip(page * this.dbReturnLimit()).limit(this.dbReturnLimit())
      if (categories.length === 0) {
        return reply.notFound()
      }
      
      return reply.code(200).send(categories)
    } catch (err) {
      throw err
    }
  }

  static async getCategoryById (request, reply) {
    try {
      const id = request.params.id
      if (isNaN(id)) {
        return reply.badRequest()
      }
      let category = await Category.findById(id, options)
      if (!category) {
        return reply.notFound()
      }
      return reply.code(200).send(category)
    } catch (err) {
      throw err
    }
  }

  static async addCategory (request, reply) {
    try {
      this.validateObj(request.body)

      const category = new Category(request.body)
      let newCategory = await Category.create(category)
      newCategory = newCategory.toJSON()

      delete newCategory.createdAt
      delete newCategory.updatedAt
      delete newCategory.__v
      return reply.code(201).send(newCategory)
    } catch (err) {
      if (err.message.indexOf('E11000') > -1) {
        return reply.badRequest(`ID already in database`)
      }
      throw err
    }
  }

  static async updateCategory (request, reply) {
    try {
      const id = request.params.id
      if (isNaN(id)) {
        return reply.badRequest()
      }
      
      this.validateObj(request.body)

      const updatedCategory = await Category.findByIdAndUpdate(id, {$set: request.body}, {
        new: true,
        select: options
      })

      

      if (!updatedCategory) {
        return reply.notFound()
      }

      return reply.code(200).send(updatedCategory.toJSON())
    } catch (err) {
      if (err.message.indexOf('E11000') > -1) {
        return reply.badRequest(`ID already in database`)
      }
      throw err
    }
  }

  static async deleteCategory (request, reply) {
    try {
      const id = request.params.id
      if (isNaN(id)) {
        return reply.badRequest()
      }
      const category = await Category.findByIdAndRemove(id)
      if (!category) {
        return reply.notFound()
      }
      return reply.status(204).send()
    } catch (err) {
      throw err
    }
  }
}

export default CategoriesController