import app from './app.js'

const server = await app({
  logger: {
    prettyPrint:
      process.env.NODE_ENV !== 'production'
        ? {
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l Z',
            ignore: 'pid,hostname'
          }
        : false
  }
})
//import.meta.url === `file://${process.argv[1]}`
try {
  await server.listen({ port: process.env.PORT || 3001 })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}