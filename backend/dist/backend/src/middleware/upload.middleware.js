"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = uploadMiddleware;
// Lazy upload middleware: require multer at request time and handle missing dependency
function uploadMiddleware(req, res, next) {
    let multer;
    try {
        // require at request time
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        multer = require('multer');
    }
    catch (err) {
        console.error('multer is not installed:', err);
        // send a 500 response indicating server misconfiguration
        return res.status(500).json({ error: 'Server misconfiguration: multer is not installed' });
    }
    const storage = multer.memoryStorage();
    const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
    return upload.single('file')(req, res, next);
}
