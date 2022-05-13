import { test } from 'tap'
import build from '../../app.js'
import Video from '../../models/Video.js'
import Category from '../../models/Category.js'
import { randomBytes } from 'crypto'

test('Test videosModel >', async t => {

  const app = await build({ test: true })

  t.teardown(() => app.close())

  const options = await Video.options()
  let random = randomBytes(10).toString('hex')

  let new_id
  const expected_video = {
		category: 1,
		title: "TESTE",
		description: "VIDEO",
		url: "https://www.youtube.com/watch?v=W4HDhFF7Opsw"
	}

  await t.test('Video.find empty', async t => {
    await Video.find({}, options).skip(0).limit(5).populate('category', 'title color').then((videos) => {
      t.equal(videos.length, 0, 'returns 0 videos')
    })
  })

  await t.test('Video.findByCategory', async t => {
    await Video.find({ category: 1 }, options).skip(0).limit(5).populate('category', 'title color').then((videos) => {
      t.equal(videos.length, 0, 'returns 0 videos')
    })
  })
  
  await t.test('Video.findById empty', async t => {
    await Video.findById(expected_video._id, options).populate('category', 'title color').then((video) => {
      t.equal(video, null, 'returns null for id')
    })
  })

  await t.test('Video.findFree empty', async t => {
    await Video.find({}, options).sort({ createdAt: 1 }).limit(5).populate('category', 'title color').then((videos) => {
      t.equal(videos.length, 0, 'returns 0 videos')
    })
  })

  await t.test('Video.create', async t => {
    const newCat = {
      _id: 1,
      title: "TESTE",
      color: "#f0f0f0"
    }
  
    const categoria = new Category(newCat)
    await Category.create(categoria)
    
    const video = new Video(expected_video)
    await Video.create(video).then((newVideo) => {
      newVideo = newVideo.toJSON()
      new_id = newVideo._id
      t.equal(newVideo.title, expected_video.title, 'returns correct title')
      t.equal(newVideo.description, expected_video.description, 'returns correct description')
      t.equal(newVideo.url, expected_video.url, 'returns correct url')
      t.equal(newVideo.category, expected_video.category, 'returns correct category id')
    })
  })

  await t.test('Video.find', async t => {
    await Video.find({}, options).skip(0).limit(5).populate('category', 'title color').then((videos) => {
      t.equal(videos.length, 1, 'returns correct videos length')
      let video = videos[0].toJSON()
      t.equal(video.title, expected_video.title, 'returns correct title')
      t.equal(video.description, expected_video.description, 'returns correct description')
      t.equal(video.url, expected_video.url, 'returns correct url')
      t.equal(video.category._id, expected_video.category, 'returns correct category id')
    })
  })

  await t.test('Video.findByCategory', async t => {
    await Video.find({ category: 1 }, options).skip(0).limit(5).populate('category', 'title color').then((videos) => {
      let video = videos[0].toJSON()
      t.equal(video.category._id, 1, 'returns correct category id')
    })
  })

  await t.test('Video.findById', async t => {
    await Video.findById(new_id, options).populate('category', 'title color').then((video) => {
      video = video.toJSON()
      t.not(video, null, 'returns a video for id')
      t.equal(video.title, expected_video.title, 'returns correct title')
      t.equal(video.description, expected_video.description, 'returns correct description')
      t.equal(video.url, expected_video.url, 'returns correct url')
      t.equal(video.category._id, expected_video.category, 'returns correct category id')
    })
  })

  await t.test('Video.findFree', async t => {
    await Video.find({}, options).sort({ createdAt: 1 }).limit(5).populate('category', 'title color').then((videos) => {
      t.equal(videos.length, 1, 'returns correct videos length')
      let video = videos[0].toJSON()
      t.equal(video.title, expected_video.title, 'returns correct title')
      t.equal(video.description, expected_video.description, 'returns correct description')
      t.equal(video.url, expected_video.url, 'returns correct url')
      t.equal(video.category._id, expected_video.category, 'returns correct category id')
    })
  })

  const updated_video = {
    title: "TESTE ATUALIZADO",
		description: "VIDEO ATUALIZADO",
		url: "https://www.youtube.com/watch?v=W4HDhFF7Opsw_123"+random,
    category: 2
  }
  
  await t.test('Categoria.findByIdAndUpdate', async t => {
    const newCat = {
      _id: 2,
      title: "UPDATE",
      color: "#ffffff"
    }

    const categoria = new Category(newCat)
    await Category.create(categoria)

    await Video.findByIdAndUpdate(new_id, {$set: updated_video}, {
      new: true,
      select: options
    }).populate('category', 'title cor').then((updatedVideo) => {
      updatedVideo = updatedVideo.toJSON()
      t.equal(updatedVideo.title, updated_video.title, 'returns correct title')
      t.equal(updatedVideo.description, updated_video.description, 'returns correct description')
      t.equal(updatedVideo.url, updated_video.url, 'returns correct url')
      t.equal(updatedVideo.category._id, updated_video.category, 'returns correct category id')
    })
  })


  await t.test('Video.findByIdAndRemove', async t => {
    await Video.findByIdAndRemove(new_id).then((removedVideo) => {
      removedVideo = removedVideo.toJSON()
      t.equal(removedVideo.title, updated_video.title, 'returns correct title')
      t.equal(removedVideo.description, updated_video.description, 'returns correct description')
      t.equal(removedVideo.url, updated_video.url, 'returns correct url')
      t.equal(removedVideo.category, updated_video.category, 'returns correct category id')
    })
  })

  

})