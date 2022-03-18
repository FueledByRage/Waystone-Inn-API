const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const path = require('path')
const crypto = require('crypto')
require('dotenv').config({
    path: __dirname + '../.env'
})


const storages = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadOptions = {
                '/user/edit':() => cb(null, path.resolve(__dirname, "..", "uploads", "img", "profile")),
                '/user/register': () => cb(null, path.resolve(__dirname, "..", "uploads", "img", "profile")),
                '/post/register':() => cb(null, path.resolve(__dirname, "..", "uploads", "img"))
            }

            const selectedOption = uploadOptions[req.url];
            
            selectedOption();
          },
          filename: (req, file, cb) => {
            crypto.randomBytes(16, (error, hash) =>{
                if(error) cb(error)

                file.key = `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
          }
    }),
    //Not tested yet
    s3: multerS3({
        s3: new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
            secretAccessKey: process.env.AWS_SECRET_ACCES_KEY,
            region: process.env.AWS_DEFAULT_REGION,
        }),
        bucket: 'theWaystoneInn',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key:(req, file, next)=>{
            file.key = `${req.body.user}_${file.originalname}`

            next(null, file.key)
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, "..", "uploads", "img"),
    storage: storages['local'],
    fileFilter:(req, file, next) =>{
        const allowedMimes = [
            'image/jpeg',
            'image:pjpeg',
            'image/png',
            'image/gif'
    ]

    if(allowedMimes.includes(file.mimetype)) next(null, true)
    else next(new Error('Invalid file type!'));

    }

}