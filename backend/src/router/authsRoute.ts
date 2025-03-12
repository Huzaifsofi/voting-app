import { Router } from 'express'
const router = Router()

import { signup, login, jwtVerify, checkUser } from '../controller/authControll'

router.post('/signup', signup)
router.post('/login', login)
router.get('/checkusers',jwtVerify, checkUser)



export default router

