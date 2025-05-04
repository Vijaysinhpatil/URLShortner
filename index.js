const express = require("express");
const app = express();
const { connectToMongoDB } = require("./Connection");
const URL = require("./Models/url")
const cookieParser = require("cookie-parser")
const urlRoute = require("./routes/url");
const StaticRouter = require("./routes/staticRouter")
const userRoute = require('./routes/user');
const { restrictToLoggedinUserOnly , checkauth } = require("./middleware/auth");
const path = require("path")

const PORT = 8000;


connectToMongoDB("mongodb://localhost:27017/short-url-2")
  .then(() => {
    console.log("MongoDB is Connectedr");
  })
  .catch((err) => {
    console.log("Error is there", err);
  });


app.set("view engine" , "ejs")
app.set("views" , path.resolve("./Views"))
app.use(express.json());

//for parsing home data
app.use(express.urlencoded({ extended : false }))

// cookie-paerser middleware
app.use(cookieParser());
app.use("/url", restrictToLoggedinUserOnly ,urlRoute);
app.use('/user',userRoute)
app.use("/" ,checkauth ,  StaticRouter)

app.get("/test" , async (req , res) => {
  const allurls = await URL.find({});

  //redering ejs file
  return res.render('home',{
   urls : allurls,
  })

})

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  console.log("Looking for shortId:", shortId); // Debug

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(PORT, () => {
  console.log("Server Run Sucessfully");
});








    //  return res.end(`
    //      <html>
    //        <head>
    //           <body>
    //                <ol>
    //                  ${
    //                   allurls.map((url) => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`)
    //                  }
    //                </ol>
    //           </body>
    //       </head>
    //     </html>
    //   `)