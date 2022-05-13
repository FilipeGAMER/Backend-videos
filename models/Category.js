import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    _id : { type: Number, required: true },
    title: { type: String, required: true, trim: true, maxlength: 50 },
    color: { type: String, required: true, trim: true, maxlength: 20 }
  }, { timestamps: true }
)

categorySchema.statics.getCategorySchema = async function(required, removeID) {
  const bodySchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      _id: {type: 'number', minimum: 1},
      title: {type: 'string', maxLength: 50},
      color: {type: 'string', minLength: 3, maxLength: 20}
    }
  }

  if (required) {
    bodySchema.required = ['_id','title','color']
  }

  if (removeID) {
    delete bodySchema.properties._id
  }
  
  return bodySchema
}

categorySchema.statics.options = async function() { 
  return '_id title color'
}

const Category = mongoose.model('Category', categorySchema)

export default Category