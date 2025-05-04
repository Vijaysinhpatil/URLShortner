const shortid = require('shortid')
const URL = require("../Models/url")



const handleGenerateNewShortURL = async(req,res) => {
       const body = req.body;

       if(!body.url) 
       {
             return res.status(400).json({error : "URL is required"})
       }
    const shortID = shortid()
    await URL.create({
        shortId : shortID,
        redirectURL : body.url,
        visitHistory : [],
        createdBy : req.user._id
    })
    return res.render("home" , {
         id : shortID,
    })
  
}

const getHandleAnalytics = async(req , res ) => {
    // taking id from database
     const shortId = req.params.shortId;
     const result = await URL.findOne({shortId})
     return res.json({totalClicks:result.visitHistory.length , 
        analytics : result.visitHistory
     })
}
module.exports = {
    handleGenerateNewShortURL , 
    getHandleAnalytics,

}