import build from '../../app.js'
import { test } from 'tap'
import User from '../../models/User.js'

test('Test /users routes >', async t => {

  const app = await build({ test: true })

  t.teardown(() => app.close())

  const url = '/users'

  const new_user = {
    "email": "teste0@teste.com.br",
    "name": "TESTE DE USUARIO",
    "password": "123456789123456789"
  }

  const expected_user = {
    "email": "teste@teste.com.br",
    "name": "TESTE DE USUARIO",
    "password": "123456789123456789"
  }

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
      await app.inject({
        method: 'POST',
        url: url,
        body: expected_user
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })
  })

  let body = {...expected_user}
  body.password = await app.generateHash(body.password)
  const user = new User(body)
  await User.create(user)
  body = null

  let tokenJWT

  await t.test('POST /login success =', async t => {
    await app.inject({
      method: 'POST',
      url: `${url}/login`,
      body: {
        "email": expected_user.email,
        "password": expected_user.password
      }
    }).then((response) => {
      tokenJWT = response.headers['authorization']
      t.equal(response.statusCode, 204, 'returns a status code of 204')
    })
  })

  await t.test('POST success =', async t => {
    await app.inject({
      method: 'POST',
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: new_user
    }).then((response) => {
      t.equal(response.statusCode, 201, 'returns a status code of 201')
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

  await t.test('POST /login errors >', async t => {
    const method = 'POST'

    const injectObj = {
      method: method,
      url: `${url}/login`,
      headers: {
        authorization: tokenJWT
      },
      body: {
        "email": expected_user.email,
        "password": expected_user.password
      }
    }

    await t.test('Invalid EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      injectObj.body.email = "teste.teste"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.email should match pattern \"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$\"", 'returns EMAIL is not on allowed pattern')
      })
    })

    await t.test('Empty EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      injectObj.body.email = "        "
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.email should match pattern \"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$\"", 'returns EMAIL is not on allowed pattern')
      })
    })

    await t.test('No EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      delete injectObj.body.email
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should have required property 'email'", 'returns EMAIL is required')
      })
    })

    await t.test('Empty PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      injectObj.body.password = "      "
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.password should NOT be shorter than 15 characters", 'returns PASSWORD has a minimum size')
      })
    })

    await t.test('Shorter PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      injectObj.body.password = "123456789"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.password should NOT be shorter than 15 characters", 'returns PASSWORD has a minimum size')
      })
    })

    await t.test('Longer PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      injectObj.body.password = "12345678912345678912345678912345678912345678912345678912345678912345678912345678912345678912345678901"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.password should NOT be longer than 100 characters", 'returns PASSWORD has a maximum size')
      })
    })

    await t.test('No PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      delete injectObj.body.password
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should have required property 'password'", 'returns PASSWORD is required')
      })
    })


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
        "email": "teste123@teste.com.br",
        "name": "TESTE DE USUARIO",
        "password": "123456789123456789"
      }
    }

    await t.test('Duplicated EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      injectObj.body.email = "teste@teste.com.br"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Email already in database", 'returns EMAIL already in DB message')
      })
    })

    await t.test('Wrong pattern EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      injectObj.body.email = "teste.teste"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.email should match pattern \"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$\"", 'returns EMAIL is not on allowed pattern')
      })
    })

    await t.test('Empty EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      injectObj.body.email = "       "
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.email should match pattern \"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$\"", 'returns EMAIL is not on allowed pattern')
      })
    })

    await t.test('No EMAIL =', async t => {
      let prevEmail = injectObj.body.email
      delete injectObj.body.email
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.email = prevEmail
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should have required property 'email'", 'returns EMAIL is required')
      })
    })

    await t.test('Empty NAME =', async t => {
      let prevName = injectObj.body.name
      injectObj.body.name = "       "
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.name = prevName
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "Field 'name' can't be empty", 'returns NAME is required')
      })
    })

    await t.test('No NAME =', async t => {
      let prevName = injectObj.body.name
      delete injectObj.body.name
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.name = prevName
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should have required property 'name'", 'returns NAME is required')
      })
    })

    await t.test('Empty PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      injectObj.body.password = "      "
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.password should NOT be shorter than 15 characters", 'returns PASSWORD has a minimum size')
      })
    })

    await t.test('Shorter PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      injectObj.body.password = "123456789"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.password should NOT be shorter than 15 characters", 'returns PASSWORD has a minimum size')
      })
    })

    await t.test('Longer PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      injectObj.body.password = "12345678912345678912345678912345678912345678912345678912345678912345678912345678912345678912345678901"
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body.password should NOT be longer than 100 characters", 'returns PASSWORD has a maximum size')
      })
    })

    await t.test('No PASSWORD =', async t => {
      let prevPassword = injectObj.body.password
      delete injectObj.body.password
      await app.inject(injectObj).then((response) => {
        let body = response.json()
        injectObj.body.password = prevPassword
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(body.message, "body should have required property 'password'", 'returns PASSWORD is required')
      })
    })
  })
})