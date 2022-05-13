import { test } from 'tap'
import build from '../../app.js'
import Category from '../../models/Category.js'

test('Test categoriesModel >', async t => {

  const app = await build({ test: true })

  t.teardown(() => app.close())

  const options = await Category.options()

  const expected_category = {
    _id: 1,
    title: "LIVRE",
    color: "#ffffff"
  }

  await t.test('Category.find empty', async t => {
    await Category.find({}, options).skip(0 * app.dbReturnLimit()).limit(app.dbReturnLimit()).then((categories) => {
      t.equal(categories.length, 0, 'returns 0 categories')
    })
  })
 
  await t.test('Category.findById empty', async t => {
    await Category.findById(expected_category._id, options).then((category) => {
      t.equal(category, null, 'returns null for id')
    })
  })

  await t.test('Category.create', async t => {

    const category = new Category(expected_category)
    await Category.create(category).then((newCategory) => {
      newCategory = newCategory.toJSON()
  
      t.equal(newCategory._id, expected_category._id, 'returns correct _id')
      t.equal(newCategory.title, expected_category.title, 'returns correct title')
      t.equal(newCategory.color, expected_category.color, 'returns correct color')
    })
  })

  await t.test('Category.find', async t => {
    await Category.find({}, options).then((categories) => {
      t.equal(categories[0]._id, expected_category._id, 'returns correct _id')
      t.equal(categories[0].title, expected_category.title, 'returns correct title')
      t.equal(categories[0].color, expected_category.color, 'returns correct color')
    })
  })
 
  await t.test('Category.findById', async t => {
    await Category.findById(expected_category._id, options).then((category) => {
      t.equal(category._id, expected_category._id, 'returns correct _id')
      t.equal(category.title, expected_category.title, 'returns correct title')
      t.equal(category.color, expected_category.color, 'returns correct color')
    })
  })

  const updated_category = {
    title: "TESTE ATUALIZADO",
    color: "#000000"
  }
  
  await t.test('Category.findByIdAndUpdate', async t => {

    await Category.findByIdAndUpdate(expected_category._id, {$set: updated_category}, {
      new: true,
      select: options
    }).then((updatedCategory) => {
      updatedCategory = updatedCategory.toJSON()
      t.equal(updatedCategory._id, expected_category._id, 'returns correct _id')
      t.equal(updatedCategory.title, updated_category.title, 'returns correct title')
      t.equal(updatedCategory.color, updated_category.color, 'returns correct color')
    })
  })


  await t.test('Category.findByIdAndRemove', async t => {
    await Category.findByIdAndRemove(expected_category._id).then((category) => {
      category = category.toJSON()
      t.equal(category._id, expected_category._id, 'returns correct _id')
      t.equal(category.title, updated_category.title, 'returns correct title')
      t.equal(category.color, updated_category.color, 'returns correct color')
    })
  })

})