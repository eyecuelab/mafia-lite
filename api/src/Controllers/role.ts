import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roleControllers ={
  async createRole(req: any, res: any) {
    const { name, type, roleDesc } = req.body;
    const role = await prisma.role.create({
      data: {
        name: name,
        type: type,
        roleDesc: roleDesc,
      },
    })
    res.json(role)
  },

  async getRoles(req: any, res: any) {
    const roles = await prisma.role.findMany();
    res.json(roles);
  },

  async getSingleRole(req: any, res: any) {
    const { id } = req.params;

    try {
      const role = await prisma.role.findFirstOrThrow ({
        where: { id: Number(id) },
      });
      res.json(role);
    } catch (error) {
      return res.status(404).json({ error: "Role not found"})
    }
  },

  async updateRoles(req: any, res: any) {
    const { id, name, type, roleDesc } = req.body
    const updatedRoles = await prisma.role.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        type: type,
        roleDesc: roleDesc,
      },
    });
    res.json(updatedRoles);
  },

  async deleteRole(req: any, res: any) {
    const id = req.params.id;
    const deletedRole = await prisma.role.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deletedRole);
  },
}

export default roleControllers;