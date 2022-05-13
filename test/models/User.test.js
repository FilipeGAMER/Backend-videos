import { test } from 'tap'
import build from '../../app.js'
import User from '../../models/User.js'

test('Test usersModel >', async t => {
  const app = await build({ test: true })

  t.teardown(() => app.close())

  const options = await User.options()

  const expected_user = {
    "email": "teste0@teste.com.br",
    "name": "TESTE DE USUARIO",
    "password": "123456789123456789"
  }

  await t.test('User.find empty', async t => {
    await User.find({}, options).skip(0 * app.dbReturnLimit()).limit(app.dbReturnLimit()).then((users) => {
      t.equal(users.length, 0, 'returns 0 users')
    })
  })
 
  await t.test('User.findByEmail empty', async t => {
    await User.findOne({ email: expected_user.email }, options).then((user) => {
      t.equal(user, null, 'returns null for id')
    })
  })

  await t.test('User.create', async t => {
    const body = {...expected_user}
    body.password = await app.generateHash(body.password)
    const user = new User(body)
    await User.create(user).then((newUser) => {
      newUser = newUser.toJSON()
  
      t.equal(newUser.email, expected_user.email, 'returns correct email')
      t.equal(newUser.name, expected_user.name, 'returns correct name')
    })
  })

  await t.test('User.find', async t => {
    await User.find({}, options).skip(0 * app.dbReturnLimit()).limit(app.dbReturnLimit()).then((users) => {
      t.equal(users[0].email, expected_user.email, 'returns correct email')
      t.equal(users[0].name, expected_user.name, 'returns correct name')
    })
  })
 
  await t.test('User.findByEmail', async t => {
    await User.findOne({ email: expected_user.email }, options).then((user) => {
      t.equal(user.email, expected_user.email, 'returns correct email')
      t.equal(user.name, expected_user.name, 'returns correct name')
    })
  })
 
  await t.test('User.Login wrong email', async t => {
    await User.findOne({ email: "testeERROR@teste.com.br" }).then(async (user) => {
      t.equal(user, null, 'returns null for email')
    })
  })
 
  await t.test('User.Login wrong password', async t => {
    await User.findOne({ email: expected_user.email }).then(async (user) => {
      const verified = await app.compareHash("987654321", user.password)
      t.equal(verified, false, 'returns password is wrong')
    })
  })

  await t.test('User.Login', async t => {
    await User.findOne({ email: expected_user.email }).then(async (user) => {
      const verified = await app.compareHash(expected_user.password, user.password)
      t.equal(verified, true, 'returns verified password is true')
    })
  })

})