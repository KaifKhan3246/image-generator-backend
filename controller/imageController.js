import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from '../models/userModel.js'

// Controller function to generate image from prompt
// http://localhost:4000/api/image/generate-image
export const generateImage = async (req, res) => {

  try {
    const { prompt } = req.body || {}
    const userId = req.body?.userId || req.userId

    // Fetching User Details Using userId
    const user = await userModel.findById(userId)
    
    if (!user || !prompt) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    // Checking User creditBalance
    if (user.creditBalance <= 0) {
      return res.json({ success: false, message: 'No Credit Balance', creditBalance: 0 })
    }

    // Creation of new multi/part formdata
    const formdata = new FormData()
    formdata.append('prompt', prompt)

    // Calling Clipdrop API
    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formdata, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: "arraybuffer"
    })

    // Convertion of arrayBuffer to base64
    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64Image}`

    // Deduction of user credit 
    const updatedUser = await userModel.findByIdAndUpdate(user._id, { $inc: { creditBalance: -1 } }, { new: true })

    // Sending Response
    res.json({ success: true, message: "Background Removed", resultImage, creditBalance: updatedUser.creditBalance })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}