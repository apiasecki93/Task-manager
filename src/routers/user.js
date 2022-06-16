// const router = new express.Router(); //this is a new instance of express router to handle all the routes
// router.get('/test', (req, res) => {
//     res.send('This is from my other router!')
// })

// app.use(router) // register our new router to existing express app

const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')



//first route for REST API endpoint to /users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }

  
})



router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
     
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logout', auth, async (req,res,) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
 })


router.get('/users/me', auth , async (req,res) => {
    console.log('sadsa')
   res.send(req.user)
})


//mongose automatcly converts string id into object id for us


router.patch('/users/me', auth,  async (req,res) => {

    // we are checking if user which is going to be updated has requied parameters like (email,name etc)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000  //1000000 byte = 1 MB
    },
    fileFilter(req, file, cb) {  //cb is call back function
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //regex101.com
             return cb(new Error('Please upload a pdf file'))
        }

        cb(undefined, true)
        // cb(new Error('File type not supported'))
        // cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
    
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}
, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    console.log(1)
    try {
        const user = await User.findById(req.params.id)
        console.log(user)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send({error: 'User not found'})
    }
})

module.exports = router