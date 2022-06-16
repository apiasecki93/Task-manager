const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')


//GET /task?completed=true
//GET /task?limit=10
//GET /task?skip=0
//GET /task?sortBy=createdAt:desc

router.get('/task', auth, async (req,res) => {
    
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    // console.log(sort)
    try {
        // const tasks = await Task.find({})
            await req.user.populate({
                path: 'Tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                    // sort: {
                    //     // createdAt: 1 // from oldest to newest and -1 from newest to oldest
                    //     // completed: req.query.sortBy === 'completed' ? 1 : -1,
                    // }
                }
            }).execPopulate()
            //console.log(req.user.Tasks)
            res.send(req.user.Tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/task/:id', auth, async (req,res) => {

    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
    
 
})




router.post('/task', auth,  async (req,res) => {
    const task = new Task({
        ...req.body, //copy all properties from req.body to task object
        owner: req.user._id //from auth middleware
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {

    }

})




router.patch('/task/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    //req.params.id comes from url parameretrs '/task/:id' and req.body is the body of the request
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router
