const express = require('express')
const { handleGenerateNewShortURL, getHandleAnalytics } = require('../Controllers/url')
const router = express.Router()

router.post("/" , handleGenerateNewShortURL)
router.get("/analytics/:shortId" , getHandleAnalytics)
module.exports = router ;

