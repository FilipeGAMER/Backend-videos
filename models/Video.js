import mongoose from "mongoose"

const urlRegex = '^(https?:\\/\\/)(www\\.)([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\\.)+[\\w]{2,}(\\/\\S*)?$'

const videoSchema = new mongoose.Schema(
  { 
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: Number, ref: 'Category', default: 1 },
    url: { 
      type: String, required: true, trim: true, minlength: 32, maxlength: 72, unique: true,
      validate: {
        validator: function(v) {
          return new RegExp(urlRegex).test(v)
        },
        message: props => `"${props.value}" is not a valid URL!`
      }
    },
  }, { timestamps: true }
)

videoSchema.statics.geNewVideoSchema = async function() {
  const bodySchema = {
    type: 'object',
    required: ['title','description','url'],
    additionalProperties: false,
    properties: {
      title: {type: 'string', maxLength: 100},
      description: {type: 'string', maxLength: 500},
      url: {type: 'string', minLength: 32, maxLength: 72, pattern: urlRegex},
      category: {type: 'number', minimum: 1},
    }
  }
  
  return bodySchema
}

videoSchema.statics.geUpdateVideoSchema = async function() {
  const bodySchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: {type: 'string', maxLength: 100},
      description: {type: 'string', maxLength: 500},
      url: {type: 'string', minLength: 32, maxLength: 72, pattern: urlRegex},
      category: {type: 'number', minimum: 1},
    }
  }
  
  return bodySchema
}

videoSchema.statics.getQuery = async function () {
  const querySchema = {
    type: 'object',
    properties: {
      search: { type: 'string' },
      page: { type: 'number' }
    }
  }

  return querySchema
}

videoSchema.statics.getPageQuery = async function () {
  const querySchema = {
    type: 'object',
    properties: {
      page: { type: 'number' }
    }
  }

  return querySchema
}

videoSchema.statics.options = async function() { 
  return 'id title description url'
}

const Video = mongoose.model('Video', videoSchema)

export default Video