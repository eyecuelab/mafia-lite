import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userControllers = {
  async createUser(req: any, res: any) {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });
    res.json(user);
  },

  async getUsers(req: any, res: any) {
    const users = await prisma.user.findMany();
    res.json(users);
  },

  async getSingleUser(req: any, res:any) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findFirstOrThrow ({
        where: { id: Number(id) },
      });
      res.json(user);
    } catch (error) {
      return res.status(404).json({ error: "User not found"});
    }
  },

  async updateUser(req: any, res:any) {
    const {id, name, email} = req.body
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        email: email,
      },
    });
    res.json(updatedUser);
  },

  async deleteUser(req:any, res:any) {
    const id  = req.params.id;
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deletedUser);
  },
}

export default userControllers;