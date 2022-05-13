import app from './app.js'

const log = {
  level: "info",
}

if (process.env.NODE_ENV !== 'production') {
  log = {
    prettyPrint:{
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l Z',
      ignore: 'pid,hostname'
    }
  }
}

const server = await app({
  logger: log
})

//import.meta.url === `file://${process.argv[1]}`
const ADDRESS = process.env.ADDRESS || "0.0.0.0"
const PORT = process.env.PORT || 3001

try {
  await server.listen({ port: PORT, address: ADDRESS })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}