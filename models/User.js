import mongoose from "mongoose"

const emailRegex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, required: true, trim: true, unique: true,
      validate: {
        validator: function(v) {
          return new RegExp(emailRegex).test(v)
        },
        message: props => `"${props.value}" is not a valid email!`
      }
    },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true, minlength: 15, maxlength: 100 },
  }, { timestamps: true }
)

userSchema.statics.geUserSchema = async function() {
  const bodySchema = {
    type: 'object',
    required: ['email','name','password'],
    additionalProperties: false,
    properties: {
      email: {type: 'string', pattern: emailRegex },
      name: {type: 'string' },
      password: {type: 'string', minLength: 15, maxLength: 100 },
    }
  }
  
  return bodySchema
}

userSchema.statics.geUserLoginSchema = async function() {
  const bodySchema = {
    type: 'object',
    required: ['email','password'],
    additionalProperties: false,
    properties: {
      email: {type: 'string', pattern: emailRegex },
      password: {type: 'string', minLength: 15, maxLength: 100 },
    }
  }
  
  return bodySchema
}

userSchema.statics.getQuery = async function () {
  const querySchema = {
    type: 'object',
    properties: {
      page: { type: 'number' }
    }
  }

  return querySchema
}

userSchema.statics.options = async function() { 
  return 'id email name'
}

const User = mongoose.model('User', userSchema)

export default User