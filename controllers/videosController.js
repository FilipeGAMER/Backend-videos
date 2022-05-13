import Video from "../models/Video.js"
import mongoose from "mongoose"

const options = await Video.options()

async function videoFind(where, page = 0, limit) {
  return await Video.find(where, options).skip(page * limit).limit(limit).populate('category', 'title color')
}

class VideosController {
  
  static async geNewVideoSchema () {

    return Video.geNewVideoSchema()
  }

  static async geUpdateVideoSchema () {

    return Video.geUpdateVideoSchema()
  }

  static async getQuery () {

    return Video.getQuery()
  }

  static async getPageQuery () {

    return Video.getPageQuery()
  }
  
  static async getVideos (request, reply) {
    // this.log.info(">>>>>>>>>>>>")
    // this.log.info(this.version)
    // console.log(this.httpErrors)
    // console.log(this.mongoose)

    try {
      const { search, page = 0 } = request.query;
      const where = {}
      search ? where.title = search : null;

      const videos = await videoFind(where, page, this.dbReturnLimit())
      if (videos.length === 0) {
        return reply.notFound()
      }
      
      return reply.code(200).send(videos)
    } catch (err) {
      throw err
    }
  }

  static async getVideoById (request, reply) {
    try {
      const id = request.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.badRequest()
      }
      const video = await Video.findById(id, options).populate('category', 'title color')
      if (!video) {
        return reply.notFound()
      }
      return reply.code(200).send(video)
    } catch (err) {
      throw err
    }
  }

  static async addVideo (request, reply) {
    try {
      this.validateObj(request.body)
      const video = new Video(request.body)
      let newVideo = await Video.create(video)
      newVideo = newVideo.toJSON()
      delete newVideo.createdAt
      delete newVideo.updatedAt
      delete newVideo.__v
      return reply.code(201).send(newVideo)
    } catch (err) {
      if (err.message.indexOf('E11000') > -1) {
        return reply.badRequest(`URL already in database`)
      }
      throw err
      // errorHandler(err, reply)
    }
  }

  static async updateVideo (request, reply) {
    try {
      const { id } = request.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.badRequest()
      }
      
      this.validateObj(request.body)

      const video = request.body
      const updatedVideo = await Video.findByIdAndUpdate(id, {$set: video}, {
        new: true,
        select: options
      }).populate('category', 'title color')

      if (!updatedVideo) {
        return reply.notFound()
      }

      return reply.code(200).send(updatedVideo.toJSON())
    } catch (err) {
      if (err.message.indexOf('E11000') > -1) {
        return reply.badRequest(`URL already in database`)
      }
      throw err
    }
  }

  static async deleteVideo (request, reply) {
    try {
      const { id } = request.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.badRequest()
      }
      const video = await Video.findByIdAndRemove(id)
      if (!video) {
        return reply.notFound()
      }
      return reply.status(204).send()
    } catch (err) {
      throw err
    }
  }


  static async getVideosByCategory (request, reply) {
    try {
      const { page = 0 } = request.query;

      const id = request.params.id
      if (isNaN(id)) {
        return reply.badRequest()
      }
      
      let condition = { category: id }
      if (id == 1) {
        condition = { $or: [{category: id }, {category: null}] }
      }
      
      let videos = await videoFind(condition, page, this.dbReturnLimit())
      if (!videos || videos.length === 0) {
        return reply.notFound()
      }
      return reply.code(200).send(videos)
    } catch (err) {
      throw err
    }
  }

  static async getVideosFree (request, reply) {

    try {
      const videos = await Video.find({}, options).sort({ createdAt: 1 }).limit(5).populate('category', 'title color')
      if (videos.length === 0) {
        return reply.notFound()
      }
      
      return reply.code(200).send(videos)
    } catch (err) {
      throw err
    }
  }
}

export default VideosController
