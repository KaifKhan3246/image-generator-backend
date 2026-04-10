import express from 'express'
import { generateImage } from '../controller/imageControllers.js'
import authUser from '../middleware/auths.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image', authUser, generateImage)

export default imageRouter