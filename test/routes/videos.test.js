import build from '../../app.js'
import { test } from 'tap'
import User from '../../models/User.js'
import { randomBytes } from 'crypto'

test('Test /videos routes >', async t => {
  
  const app = await build({ test: true })

  t.teardown(() => app.close())

  const url = '/videos'

  const expected_user = {
    "email": "teste0@teste.com.br",
    "name": "TESTE DE USUARIO",
    "password": "123456789123456789"
  }

  let body = {...expected_user}
  body.password = await app.generateHash(body.password)
  const user = new User(body)
  await User.create(user)
  body = null

  let tokenJWT
  let id

  await app.inject({
    method: 'POST',
    url: '/users/login',
    body: {
      "email": expected_user.email,
      "password": expected_user.password
    }
  }).then((response) => {
    tokenJWT = response.headers['authorization']
  })

  await t.test('GET /free empty =', async t => {
    await app.inject({
      method: 'GET',
      url: `${url}/free`
    }).then((response) => {
      t.equal(response.statusCode, 404, 'returns a status code of 404')
    })
  })
    
  await t.test('Unauthorized tests >', async t => {
    await t.test('GET =', async t => {
      await app.inject({
        method: 'GET',
        url: url
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })

    await t.test('POST =', async t => {
      let random = randomBytes(10).toString('hex')

      await app.inject({
        method: 'POST',
        url: url,
        body: {
          "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops" + random,
          "descricao": "VIDEO TESTE",
          "titulo": "TESTE TAP"
        }
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })

    await t.test('GET "/:id" success =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/${id}`
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })

    await t.test('PUT "/:id" =', async t => {
      let random = randomBytes(10).toString('hex')

      await app.inject({
        method: 'PUT',
        url: `${url}/${id}`,
        body: {
          "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops" + random,
          "descricao": "VIDEO TESTE ATUALIZADO",
          "titulo": "TESTE TAP ATUALIZADO"
        }
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })

    await t.test('DELETE "/:id" =', async t => {
      await app.inject({
        method: 'DELETE',
        url: `${url}/${id}`
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })

  })

  await t.test('GET empty =', async t => {
    await app.inject({
      method: 'GET',
      url: url,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {
      t.equal(response.statusCode, 404, 'returns a status code of 404')
    })
  })

  await t.test('POST success =', async t => {
    let random = randomBytes(10).toString('hex')

    await app.inject({
      method: 'POST',
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: {
        "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops" + random,
        "description": "VIDEO TESTE",
        "title": "TESTE TAP"
      }
    }).then((response) => {
      id = response.json()._id
      t.equal(response.statusCode, 201, 'returns a status code of 201')
    })
  })

  await t.test('GET /free =', async t => {
    await app.inject({
      method: 'GET',
      url: `${url}/free`
    }).then((response) => {
      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('GET success =', async t => {
    await app.inject({
      method: 'GET',
      url: url,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {
      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('GET "/:id" success =', async t => {
    await app.inject({
      method: 'GET',
      url: `${url}/${id}`,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {
      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('PUT "/:id" success =', async t => {
    let random = randomBytes(10).toString('hex')

    await app.inject({
      method: 'PUT',
      url: `${url}/${id}`,
      headers: {
        authorization: tokenJWT
      },
      body: {
        "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops" + random,
        "description": "VIDEO TESTE ATUALIZADO",
        "title": "TESTE TAP ATUALIZADO"
      }
    }).then((response) => {
      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('DELETE "/:id" success =', async t => {
    await app.inject({
      method: 'DELETE',
      url: `${url}/${id}`,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {
      t.equal(response.statusCode, 204, 'returns a status code of 204')
    })
  })

  await app.inject({
    method: 'POST',
    url: url,
    headers: {
      authorization: tokenJWT
    },
    body: {
      "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops",
      "description": "VIDEO TESTE",
      "title": "TESTE TAP"
    }
  }).then((response) => {
    id = response.json()._id
  })

  await t.test('POST errors >', async t => {
    const method = 'POST'

    const injectObj = {
      method: method,
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: {
        "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops",
        "description": "VIDEO TESTE",
        "title": "TESTE TAP"
      }
    }
    
    await t.test('Duplicated URL =', async t => {
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "URL already in database", 'returns URL already in DB message')
      })
    })

    await t.test('Wrong pattern URL =', async t => {
      let prevUrl = injectObj.body.url
      injectObj.body.url = "www.youtube.com/watch?v=W4HDhFF7Ops"
      await app.inject(injectObj).then(response => {
        let body = response.json()

        injectObj.body.url = prevUrl
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'body.url should match pattern "^(https?:\\/\\/)(www\\.)([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\\.)+[\\w]{2,}(\\/\\S*)?$"', 'returns that URL was not in the correct format')
      })
    })

    await t.test('Shorter URL =', async t => {
      let prevUrl = injectObj.body.url
      injectObj.body.url = "https://www.youtube.com/watch?v"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.url = prevUrl
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.url should NOT be shorter than 32 characters", 'returns URL is shorter than 32 chars')
      })
    })

    await t.test('Longer URL =', async t => {
      let prevUrl = injectObj.body.url
      injectObj.body.url = "https://www.youtube.com/watch?v=W4HDhFF7OpsW4HDhFF7OpsW4HDhFF7OpsW4HDhFF7Ops"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.url = prevUrl
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.url should NOT be longer than 72 characters", 'returns URL is longer than 72 chars')
      })
    })

    await t.test('empty DESCRIPTION =', async t => {
      let prevDescription = injectObj.body.description
      injectObj.body.description = "           "
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.description = prevDescription
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Field 'description' can't be empty", 'returns DESCRICAO is empty')
      })
    })

    await t.test('Longer DESCRICAO =', async t => {
      let prevDescription = injectObj.body.description
      injectObj.body.description = "VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.description = prevDescription
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.description should NOT be longer than 500 characters", 'returns DESCRICAO is longer than 500 chars')
      })
    })

    await t.test('empty TITLE =', async t => {
      let prevTitle = injectObj.body.title
      injectObj.body.title = "           "
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.title = prevTitle
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Field 'title' can't be empty", 'returns TITLE is empty')
      })
    })

    await t.test('Longer TITLE =', async t => {
      let prevTitle = injectObj.body.title
      injectObj.body.title = "TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.title = prevTitle
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.title should NOT be longer than 100 characters", 'returns TITLE is longer than 100 chars')
      })
    })

    await t.test('Empty body =', async t => {
      let prevBody = injectObj.body
      injectObj.body = {}
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body = prevBody
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should have required property 'title'", "returns that Body can't be empty message")
      })
    })

    await t.test('No body =', async t => {
      delete injectObj.body
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should be object", "returns Body has to be object")
      })
    })
  })

  await t.test('GET errors >', async t => {
    const method = 'GET'
    
    const injectObj = {
      method: method,
      url: `${url}/1`,
      headers: {
        authorization: tokenJWT
      }
    }

    await t.test('Incorrect "/:id" =', async t => {
      await app.inject(injectObj).then((response) => {
        let body = response.json()
  
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'Bad Request', 'ID not in the correct format')
      })
      
    })
    
    await t.test('Inexistent "/:id" =', async t => {
      injectObj.url = `${url}/6271ae1fc3f82a42c81366ab`
      
      await app.inject(injectObj).then((response) => {
        let body = response.json()
  
        t.equal(response.statusCode, 404, 'returns a status code of 404')
        t.equal(body.message, 'Not Found', 'ID not found')
      })
      
    })
  })

  await t.test('PUT errors >', async t => {
    const method = 'PUT'

    const injectObj = {
      method: method,
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: {
        "url": "https://www.youtube.com/watch?v=W4HDhFF7Ops",
        "description": "VIDEO TESTE",
        "title": "TESTE TAP"
      }
    }

    await t.test('Incorrect "/:id" =', async t => {
      injectObj.url = `${url}/1`
      await app.inject(injectObj).then((response) => {
        let body = response.json()
  
        injectObj.url = url
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'Bad Request', 'returns that ID was not in the correct format')
      })
    })

    await t.test('Inexistent "/:id" =', async t => {
      injectObj.url = `${url}/6271ae1fc3f82a42c81366ab`
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        
        injectObj.url = url
        t.equal(response.statusCode, 404, 'returns a status code of 404')
        t.equal(body.message, 'Not Found', 'returns that ID was not found')
      })
      
    })

    await t.test('No "/:id" =', async t => {
      injectObj.url = `${url}/`
      await app.inject(injectObj).then(response => {
        let body = response.json()

        injectObj.url = url
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'Bad Request', 'returns that ID must be informed')
      })
    })

    injectObj.url = `${url}/${id}`

    await t.test('Wrong pattern URL =', async t => {
      let prevUrl = injectObj.body.url
      injectObj.body.url = "www.youtube.com/watch?v=W4HDhFF7Ops"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.url = prevUrl
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'body.url should match pattern "^(https?:\\/\\/)(www\\.)([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\\.)+[\\w]{2,}(\\/\\S*)?$"', 'returns that URL was not in the correct format')
      })
    })

    await t.test('Shorter URL =', async t => {
      let prevUrl = injectObj.body.url
      injectObj.body.url = "https://www.youtube.com/watch?v"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.url = prevUrl
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.url should NOT be shorter than 32 characters", 'returns URL is shorter than 32 chars')
      })
    })

    await t.test('Longer URL =', async t => {
      let prevUrl = injectObj.body.url
      injectObj.body.url = "https://www.youtube.com/watch?v=W4HDhFF7OpsW4HDhFF7OpsW4HDhFF7OpsW4HDhFF7Ops"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.url = prevUrl
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.url should NOT be longer than 72 characters", 'returns URL is longer than 72 chars')
      })
    })

    await t.test('empty DESCRIPTION =', async t => {
      let prevDescription = injectObj.body.description
      injectObj.body.description = "           "
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.description = prevDescription
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Field 'description' can't be empty", 'returns DESCRIPTION is empty')
      })
    })

    await t.test('Longer DESCRIPTION =', async t => {
      let prevDescription = injectObj.body.description
      injectObj.body.description = "VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE VIDEO TESTE"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.description = prevDescription
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.description should NOT be longer than 500 characters", 'returns DESCRIPTION is longer than 500 chars')
      })
    })

    await t.test('empty TITLE =', async t => {
      let prevTitle = injectObj.body.title
      injectObj.body.title = "           "
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.description = prevTitle
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Field 'title' can't be empty", 'returns TITLE is empty')
      })
    })

    await t.test('Longer TITLE =', async t => {
      let prevTitle = injectObj.body.title
      injectObj.body.title = "TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP TESTE TAP"
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body.description = prevTitle
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.title should NOT be longer than 100 characters", 'returns TITLE is longer than 100 chars')
      })
    })

    await t.test('Empty body =', async t => {
      let prevBody = injectObj.body
      injectObj.body = {}
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        injectObj.body = prevBody
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Body can't be empty", "returns Body can't be empty message")
      })
    })

    await t.test('No body =', async t => {
      delete injectObj.body
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should be object", "returns Body has to be object")
      })
    })
  })

  await t.test('DELETE errors >', async t => {
    const method = 'DELETE'

    const injectObj = {
      method: method,
      url: `${url}/1`,
      headers: {
        authorization: tokenJWT
      }
    }

    await t.test('Incorrect "/:id" =', async t => {
      await app.inject(injectObj).then(response => {
        let body = response.json()
      
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'Bad Request', 'returns that ID was not in the correct format')
      })
    })

    await t.test('Inexistent "/:id" =', async t => {
      injectObj.url = `${url}/6271ae1fc3f82a42c81366ab`
      await app.inject(injectObj).then(response => {
        let body = response.json()

        t.equal(response.statusCode, 404, 'returns a status code of 404')
        t.equal(body.message, 'Not Found', 'returns that ID was not found')
      })
    })

    await t.test('No "/:id" =', async t => {
      injectObj.url = `${url}/`
      await app.inject(injectObj).then(response => {
        let body = response.json()

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, 'Bad Request', 'returns that ID must be informed')
      })
    })

  })
})
