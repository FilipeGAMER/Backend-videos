import 'make-promises-safe'
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fastify from 'fastify'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function(opts={}) {
  const app = fastify(opts)
  
  app.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  app.register(autoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  return app
}
