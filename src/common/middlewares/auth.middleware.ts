import { Injectable, NestMiddleware, HttpStatus, HttpException, ConsoleLogger } from '@nestjs/common';
import { AppConfig } from "../../app.config";
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/interfaces/user.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

	async use(req: any, res: any, next: () => void) {
		// check header or url parameters or post parameters for token
		let token = req.headers['Authorization'] || req.headers['authorization'];

		if(token) {
			token = req.headers.authorization.split(' ')[1];

			let decodedToken;

			try {
				decodedToken = await jwt.verify(token, AppConfig.APPLICATION_KEY);
			}catch (err) {
				decodedToken = null;
			}

			if(decodedToken != null) {
				const user = await this.userModel.findOne({
					_id: decodedToken._id,
				}).exec();

				if(user != null)  {
					req.decoded = user;
					next();
				}else {
					throw new HttpException('Invalid user account - Access Restricted!', HttpStatus.FORBIDDEN);
				}
			}else {
				throw new HttpException('Expired token - Access Restricted!', HttpStatus.FORBIDDEN);
			}
		}else {
			throw new HttpException('Authorization header not found - Access Restricted!', HttpStatus.FORBIDDEN);
		}
	}
}
