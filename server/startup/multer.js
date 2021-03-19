const multer = require('multer');

module.exports = function () {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, 'img' + '-' + Date.now())
        }
    });
        
    const upload = multer({ storage: storage });
    return upload;
}
