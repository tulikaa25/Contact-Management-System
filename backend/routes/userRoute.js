import express from 'express'
import { addUser, getUsers,userSearch,delUser } from '../controllers/contactController.js';


const userRouter=express.Router()           //

userRouter.post('/add-user',addUser)  
userRouter.get('/get-users',getUsers) 
userRouter.get('/search-user',userSearch)
userRouter.delete('/delete-user',delUser)
export default userRouter


