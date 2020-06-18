/*****************************************************************************
 *  DEPENDENCIES
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';

import { User, UserRole, UserEntity } from 'app/entities/user.entity';

@Injectable()
export class UserModel {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async create(username: string, email: string, password: string, role: UserRole): Promise<UserEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.userRepository
					.insert({
						username: username,
						email: email,
						password: password,
						role: role,
					})
					.catch(err => {
						throw 'Error finding the user';
					});
				const userEntity = await this.userRepository.findOne({ id: data.raw.insertId }).catch(err => {
					throw err;
				});
				resolve(userEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/

	public async findOneByID(id: number): Promise<UserEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const userEntity = await this.userRepository.findOne({ id: id }).catch(err => {
					throw 'Error finding the user';
				});
				resolve(userEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByUsername(username: string): Promise<UserEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(
					await this.userRepository.findOne({ username: username }).catch(err => {
						throw 'Error finding the user';
					}),
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  CHECK
	 *****************************************************************************/
	public async CheckUsernameAndEmailDontExist(username: string, email: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.userRepository
					.count({
						where: [{ username: username }, { email: email }],
					})
					.catch(err => {
						throw 'Error counting the user';
					});
				if (count > 0) throw 'Invalid username or email. It already exists';
				else resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  DELETE
	 *****************************************************************************/
}
