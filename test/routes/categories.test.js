import build from '../../app.js'
import { test } from 'tap'
import User from '../../models/User.js'
import Video from '../../models/Video.js'

test('Test /categories routes >', async t => {
  
  const app = await build({ test: true })

  t.teardown(() => app.close())

  const url = '/categories'

  const new_cat = {
    "_id": 1,
    "title": "TESTE",
    "color": "#ffffff"
  }

  const updated_cat = {
    "title": "TESTE ATUALIZADO",
    "color": "BLACK"
  }

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
        body: new_cat
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })
  
    await t.test('GET "/:id" =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/${new_cat._id}`
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })
  
    await t.test('GET "/:id/videos" =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/${new_cat._id}/videos`
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })
  
    await t.test('PUT "/:id" =', async t => {
      await app.inject({
        method: 'PUT',
        url: `${url}/${new_cat._id}`,
        body: updated_cat
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })
  
    await t.test('DELETE "/:id" =', async t => {
      await app.inject({
        method: 'DELETE',
        url: `${url}/${new_cat._id}`
      }).then((response) => {
        t.equal(response.statusCode, 401, 'returns a status code of 401')
      })
    })

  })

  await t.test('POST success =', async t => {
    await app.inject({
      method: 'POST',
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: new_cat
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

  await t.test('GET "/:id" success =', async t => {
    await app.inject({
      method: 'GET',
      url: `${url}/${new_cat._id}`,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {

      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('GET "/:id/videos" empty =', async t => {
    await app.inject({
      method: 'GET',
      url: `${url}/${new_cat._id}/videos`,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {

      t.equal(response.statusCode, 404, 'returns a status code of 404')
    })
  })

  const expected_video = {
		category: 1,
		title: "TESTE",
		description: "VIDEO",
		url: "https://www.youtube.com/watch?v=W4HDhFF7Opsw"
	}
  const video = new Video(expected_video)
  await Video.create(video)

  await t.test('GET "/:id/videos" success =', async t => {
    await app.inject({
      method: 'GET',
      url: `${url}/${new_cat._id}/videos`,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {

      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('PUT "/:id" success =', async t => {
    await app.inject({
      method: 'PUT',
      url: `${url}/${new_cat._id}`,
      headers: {
        authorization: tokenJWT
      },
      body: {
        "title": "TESTE ATUALIZADO",
        "color": "BLACK"
      }
    }).then((response) => {

      t.equal(response.statusCode, 200, 'returns a status code of 200')
    })
  })

  await t.test('DELETE "/:id" success =', async t => {
    await app.inject({
      method: 'DELETE',
      url: `${url}/${new_cat._id}`,
      headers: {
        authorization: tokenJWT
      }
    }).then((response) => {

      t.equal(response.statusCode, 204, 'returns a status code of 204')
    })
  })

  await t.test('POST errors >', async t => {
    const method = 'POST'

    await t.test('No _id =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE",
          "color": "#ffffff"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body should have required property '_id'", 'returns _id is required')
      })
    })

    await t.test('No title =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": 2,
          "color": "#ffffff"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body should have required property 'title'", 'returns title is required')
      })
    })

    await t.test('No color =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": 2,
          "title": "TESTE",
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body should have required property 'color'", 'returns color is required')
      })
    })

    await app.inject({
      method: 'POST',
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: new_cat
    })

    await t.test('Duplicated _id =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": new_cat._id,
          "title": "TESTE",
          "color": "#ffffff"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "ID already in database", 'returns ID already in DB message')
      })
    })
    
    await t.test('Wrong format _id =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": "#@$",
          "title": "TESTE",
          "color": "#ffffff"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body._id should be number", 'returns ID is in wrong format')
      })
    })

    await t.test('Empty title =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": 2,
          "title": "",
          "color": "#ffffff"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "Field 'title' can't be empty", "returns title can't be empty")
      })
    })

    await t.test('Empty color =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": 2,
          "title": "TESTE",
          "color": ""
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body.color should NOT be shorter than 3 characters", "returns that color can't be shorter than 3 chars")
      })
    })

    await t.test('Empty body =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        },
        body: {}
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body should have required property '_id'", "returns that Body can't be empty message")
      })
    })

    await t.test('No body =', async t => {
      await app.inject({
        method: 'POST',
        url: url,
        headers: {
          authorization: tokenJWT
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body should be object", "returns Body has to be object")
      })
    })

  })

  await t.test('GET errors >', async t => {
    const method = 'GET'

    await t.test('Incorect "/:id" =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/asd`,
        headers: {
          authorization: tokenJWT
        }
      }).then((response) => {
  
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, 'Bad Request', 'ID not in the correct format')
      })
      
    })

    await t.test('Incorrect "/:id/videos" =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/asd/videos`,
        headers: {
          authorization: tokenJWT
        }
      }).then((response) => {
  
        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, 'Bad Request', 'ID not in the correct format')
      })
      
    })

    await t.test('Inexistent "/:id" =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/0`,
        headers: {
          authorization: tokenJWT
        }
      }).then((response) => {
  
        t.equal(response.statusCode, 404, 'returns a status code of 404')
        t.equal(response.json().message, 'Not Found', 'ID not found')
      })
      
    })

    await t.test('Inexistent "/:id/videos" =', async t => {
      await app.inject({
        method: 'GET',
        url: `${url}/0/videos`,
        headers: {
          authorization: tokenJWT
        }
      }).then((response) => {
  
        t.equal(response.statusCode, 404, 'returns a status code of 404')
        t.equal(response.json().message, 'Not Found', 'ID not found')
      })
      
    })

  })

  await t.test('PUT errors >', async t => {
    const method = 'PUT'

    await app.inject({
      method: 'POST',
      url: url,
      headers: {
        authorization: tokenJWT
      },
      body: new_cat
    })

    await t.test('Incorrect "/:id" =', async t => {
      await app.inject({
        method: method,
        url: `${url}/asd`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE ATUALIZADO",
          "color": "BLACK ATUALIZADO"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, 'Bad Request', 'returns that ID was not in the correct format')
      })
    })

    await t.test('Inexistent "/:id" =', async t => {
      const response = await app.inject({
        method: method,
        url: `${url}/0`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE ATUALIZADO",
          "color": "BLACK ATUALIZADO"
        }
      })
      
      let body = response.json()

      t.equal(response.statusCode, 404, 'returns a status code of 404')
      t.equal(body.message, 'Not Found', 'returns that ID was not found')
    })

    await t.test('No "/:id" =', async t => {
      const response = await app.inject({
        method: method,
        url: `${url}/`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE ATUALIZADO",
          "color": "BLACK ATUALIZADO"
        }
      })
      
      let body = response.json()

      t.equal(response.statusCode, 404, 'returns a status code of 404')
      t.equal(body.message, 'Not Found', 'returns that ID was not found')
    })

    await t.test('Empty title =', async t => {
      await app.inject({
        method: method,
        url: `${url}/${new_cat._id}`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": new_cat._id,
          "title": "",
          "color": "#ffffff"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "Field 'title' can't be empty", "returns title can't be empty")
      })
    })

    await t.test('Empty color =', async t => {
      await app.inject({
        method: method,
        url: `${url}/${new_cat._id}`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "_id": new_cat._id,
          "title": "TESTE",
          "color": ""
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body.color should NOT be shorter than 3 characters", "returns that color can't be shorter than 3 chars")
      })
    })

    await t.test('Empty body =', async t => {
      await app.inject({
        method: method,
        url: `${url}/${new_cat._id}`,
        headers: {
          authorization: tokenJWT
        },
        body: {}
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "Body can't be empty", "returns that Body can't be empty message")
      })
    })

    await t.test('No body =', async t => {
      await app.inject({
        method: method,
        url: `${url}/${new_cat._id}`,
        headers: {
          authorization: tokenJWT
        },
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, "body should be object", "returns Body has to be object")
      })
    })

    await app.inject({
      method: 'DELETE',
      url: `${url}/+${new_cat._id}`,
      headers: {
        authorization: tokenJWT
      }
    })
  })

  await t.test('DELETE errors >', async t => {
    const method = 'DELETE'

    await t.test('Incorrect "/:id" =', async t => {
      await app.inject({
        method: method,
        url: `${url}/asd`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE ATUALIZADO",
          "color": "BLACK ATUALIZADO"
        }
      }).then((response) => {

        t.equal(response.statusCode, 400, 'returns a status code of 400')
        t.equal(response.json().message, 'Bad Request', 'returns that ID was not in the correct format')
      })
    })

    await t.test('Inexistent "/:id" =', async t => {
      const response = await app.inject({
        method: method,
        url: `${url}/0`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE ATUALIZADO",
          "color": "BLACK ATUALIZADO"
        }
      })
      
      let body = response.json()

      t.equal(response.statusCode, 404, 'returns a status code of 404')
      t.equal(body.message, 'Not Found', 'returns that ID was not found')
    })

    await t.test('No "/:id" =', async t => {
      const response = await app.inject({
        method: method,
        url: `${url}/`,
        headers: {
          authorization: tokenJWT
        },
        body: {
          "title": "TESTE ATUALIZADO",
          "color": "BLACK ATUALIZADO"
        }
      })
      
      let body = response.json()

      t.equal(response.statusCode, 404, 'returns a status code of 404')
      t.equal(body.message, 'Not Found', 'returns that ID was not found')
    })
    
  })

})