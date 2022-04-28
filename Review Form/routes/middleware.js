import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const path = `./uploads`
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
    limits: {
        fileSize: 4 * 1024 * 1024
    }
})

const upload = multer({ storage: storage })
export { upload };