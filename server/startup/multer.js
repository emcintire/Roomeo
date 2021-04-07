const multer = require('multer');

module.exports = function () {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, '../client/src/uploads')
        },
        filename: (req, file, cb) => {
            cb(null, 'img' + '-' + Date.now() + '.png')
        }
    });
        
    const upload = multer({ storage: storage });
    return upload;
}
