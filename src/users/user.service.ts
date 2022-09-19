import { Request, Response } from 'express'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import client from '../prisma/prisma'

class UserService {
	public async createUser(req: Request, res: Response) {
		const { username, email, password } = req.body

		const userEmailExisits = await client.user.findFirst({ where: { username: username } })

		if (userEmailExisits) {
			res.json({ msg: 'O usuario já existe' })
			return
		}

		const passwordCrypt = await hash(password, 8)

		client.user.create({
			data: {
				username,
				email,
				password: passwordCrypt
			}
		}).then(() => {
			return res.json({ msg: 'Usuario criado com sucesso!' }).status(200)
		})
	}

	public async authUser(req: Request, res: Response) {
		const { username, password } = req.body

		const userUsernameExisits = await client.user.findFirst({ where: { username } })
		const passHash = userUsernameExisits!.password

		if (!userUsernameExisits) {
			res.json({ msg: 'Usuario ou senha errados' })
			return
		}

		const passwordMatch = await compare(password, passHash!)

		if (!passwordMatch) {
			res.json({ msg: 'Usuario ou senha errados' })
			return
		}

		const token = sign({ username: username, email: userUsernameExisits!.email }, process.env.JWT_SECRET!, {
			expiresIn: '12h'
		})

		return res.json({ token: token }).status(200)
	}
}

export default new UserService()