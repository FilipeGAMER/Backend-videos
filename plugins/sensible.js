import fp from 'fastify-plugin'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify, opts) => {
  fastify.register(await import('@fastify/sensible'), {
    errorHandler: true
  })
})

/*
4xx

fastify.httpErrors.badRequest()
fastify.httpErrors.unauthorized()
fastify.httpErrors.paymentRequired()
fastify.httpErrors.forbidden()
fastify.httpErrors.notFound()
fastify.httpErrors.methodNotAllowed()
fastify.httpErrors.notAcceptable()
fastify.httpErrors.proxyAuthenticationRequired()
fastify.httpErrors.requestTimeout()
fastify.httpErrors.conflict()
fastify.httpErrors.gone()
fastify.httpErrors.lengthRequired()
fastify.httpErrors.preconditionFailed()
fastify.httpErrors.payloadTooLarge()
fastify.httpErrors.uriTooLong()
fastify.httpErrors.unsupportedMediaType()
fastify.httpErrors.rangeNotSatisfiable()
fastify.httpErrors.expectationFailed()
fastify.httpErrors.imateapot()
fastify.httpErrors.misdirectedRequest()
fastify.httpErrors.unprocessableEntity()
fastify.httpErrors.locked()
fastify.httpErrors.failedDependency()
fastify.httpErrors.tooEarly()
fastify.httpErrors.upgradeRequired()
fastify.httpErrors.preconditionRequired()
fastify.httpErrors.tooManyRequests()
fastify.httpErrors.requestHeaderFieldsTooLarge()
fastify.httpErrors.unavailableForLegalReasons()
5xx

fastify.httpErrors.internalServerError()
fastify.httpErrors.notImplemented()
fastify.httpErrors.badGateway()
fastify.httpErrors.serviceUnavailable()
fastify.httpErrors.gatewayTimeout()
fastify.httpErrors.httpVersionNotSupported()
fastify.httpErrors.variantAlsoNegotiates()
fastify.httpErrors.insufficientStorage()
fastify.httpErrors.loopDetected()
fastify.httpErrors.bandwidthLimitExceeded()
fastify.httpErrors.notExtended()
fastify.httpErrors.networkAuthenticationRequired()
*/