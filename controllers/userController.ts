import { Request, Response } from 'express';

// User Model
import { UserModel } from '../models/userModel';

async function getUsers(req: Request, res: Response) {
    try {
        const users = await UserModel.query();
        res.status(200).send({
            code: 200,
            status: 'success',
            data: users
        });

        if (users.length === 0) {
            res.status(404).send({
                code: 404,
                status: 'fail',
                message: 'Users not found'
            });
        }

        console.log('getUsers : ', users);
    } catch (error: any) {
        res.status(500).send({
            code: 500,
            status: 'error',
            message: error.message
        });
    }
}

async function getUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const user = await UserModel.query().findById(id);

        if (!user) {
            res.status(404).send({
                code: 404,
                status: 'fail',
                message: 'User not found'
            });
        } else {
            res.status(200).send({
                code: 200,
                status: 'success',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at
                }
            });
        }

        console.log('getUserById : ', user);

    } catch (error: any) {
        res.status(500).send({
            code: 500,
            status: 'error',
            message: error.message
        });
    }
}

async function createUser(req: Request, res: Response) {
    const { name, email }: { name: string, email: string } = req.body;
    try {
        if (!name) {
            res.status(400).send({
                code: 400,
                status: 'fail',
                message: 'Please provide name'
            });
        } else if (!email) {
            res.status(400).send({
                code: 400,
                status: 'fail',
                message: 'Please provide email'
            });
        } else {
            const newUser = await UserModel.query().insert({
                name: name,
                email: email
            });

            res.status(201).send({
                code: 201,
                status: 'success',
                message: 'User created successfully',
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });

            console.log('createUser : ', newUser);
        }
    } catch (error: any) {
        res.status(500).send({
            code: 500,
            status: 'error',
            message: error.message
        });
    }
}

async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email }: { name: string, email: string } = req.body;

    try {
        const selectedUser = await UserModel.query().findById(id);

        console.log('selectedUser : ', selectedUser);

        if (!selectedUser) {
            res.status(404).send({
                code: 404,
                status: 'fail',
                message: 'User not found'
            });
        } else {
            await UserModel.query().findById(id).patch({
                name: name || selectedUser?.name,
                email: email || selectedUser?.email,
                updated_at: new Date().toISOString()
            });

            res.status(200).send({
                code: 200,
                status: 'success',
                message: 'User with id ' + id + ' updated successfully',
                data: {
                    id: id,
                    name: name || selectedUser?.name,
                    email: email || selectedUser?.email,
                    updatedAt: new Date().toISOString()
                }
            });

            console.log('updateUser : ', id);
        }
    } catch (error: any) {
        res.status(500).send({
            code: 500,
            status: 'error',
            message: error.message
        });
    }
}

async function deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const user = await UserModel.query().findById(id);

        if (!user) {
            res.status(404).send({
                code: 404,
                status: 'fail',
                message: 'User not found'
            });
        } else {
            await UserModel.query().deleteById(id);
            res.status(200).send({
                code: 200,
                status: 'success',
                message: 'User with id ' + user.id + ' deleted successfully'
            });
        }

        console.log('deleteUser : ', user);
    } catch (error: any) {
        res.status(500).send({
            code: 500,
            status: 'error',
            message: error.message
        });
    }
}

export { getUsers, getUserById, createUser, updateUser, deleteUser };