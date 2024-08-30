const cloudinary = require('cloudinary').v2
require('dotenv').config()
const cloudinaryConnect = async (file) => {
    cloudinary.config({
        cloud_name :process.env.FILE_UPLOAD_CLOUD_NAME,
        api_key: process.env.FILE_UPLOAD_CLOUD_API_KEY,
        api_secret: process.env.FILE_UPLOAD_CLOUD_API_SECRET_KEY
    })

    const result = await cloudinary.uploader.upload(file, (error, result) => {
        if (error) {
            return {
                status: 400,
                message: error.message
            }
        } else {
            return {
                status: 200,
                message: result
            }
        }
    })

     return {
        status: 200,
        message: result
    }
}

module.exports = cloudinaryConnect