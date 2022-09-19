import { Router } from 'express'
import userService from './user.service'

class UsersController {
	router = Router()

	constructor() {
		this.initRoutes()
	}

	initRoutes() {
		this.router.post('/userCreate', userService.createUser)
		this.router.post('/userAuth', userService.authUser)
	}
}

export default new UsersController()