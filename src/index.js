const express = require('express');
require('./db/mongoose')
// const User = require('./models/user')
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//REST API means REpresentational State Transfer


const app = express();
const port = process.env.PORT
 
//
// Without middleware: new request -> run route handler
//
// With middleware: new request -> do something -> run route handler
//

// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // console.log(req.headers)
//     // console.log(req.body)
//     if(req.method === 'GET') {
//         console.log('GET request received')
//         res.send('GET request are disabled')
//     } else {
//         next() //if next() will be not used then non futer request will not be handled
//     }
// })

// uncomment Maintenence funnction when needed
// app.use((req, res, next) => {
//     res.status(502).send({error: 'Side is currently down because of maintenance. Try again later.'})
// })

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000  //1000000 byte = 1 MB
//     },
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }


// app.post('/upload', errorMiddleware, (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })



// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image'))
//         }
//         cb(undefined, true)
//     }
// })





app.use(express.json()); //it's going to automatically parse incoming JSON to an Object so we can acces it in our request handelers
app.use(userRouter);
app.use(taskRouter);







app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})



// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
// //    const task = await Task.findById('629a54f67be99a23c0d2935e')
// //    await task.populate('owner').execPopulate()
// //     console.log(task.owner)

//     // const user = await User.findById('629a628695bbe798acce4fe5')
//     // await user.populate('Tasks').execPopulate()
//     // console.log(user.Tasks)
// }

// main()