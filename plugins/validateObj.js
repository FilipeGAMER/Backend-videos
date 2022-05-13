import fp from 'fastify-plugin'

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

export default fp(async (fastify, opts) => {
  fastify.decorate('validateObj', function (obj) {
    if (Object.keys(obj).length === 0) {
      let err = new Error(`Body can't be empty`)
      err.statusCode = 400
      throw err
    }
  
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        if (typeof element === 'number') {
          continue
        }
        if (element.trim() === "") {
          let err = new Error(`Field '${key}' can't be empty`)
          err.statusCode = 400
          throw err
        }
      }
    }
  })
})
