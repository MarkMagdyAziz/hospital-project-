const express= require('express')
const multer = require('multer')
const User = require('../models/user.model')
const auth = require('../middleware/auth')
const router = new express.Router()
const fs = require('fs')

router.get('/', async(req, res)=>{
    res.send('test')
})



module.exports=router