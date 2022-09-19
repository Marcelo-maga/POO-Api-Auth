import express, { json } from 'express'
import userController from './users/user.controller'

class App {
	public express: express.Application

	constructor() {
		this.express = express()
	}

	middlewares() {
		this.express.use(json());
	}

	routes() {
		this.express.use(userController.router)
	}

	listen(port: number) {
		this.express.listen(port)
	}
}

export default new App()