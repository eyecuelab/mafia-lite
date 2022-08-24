import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createRole = async (name: string, type: string, roleDesc: string) => {
  return await prisma.role.create ({
    data: {
      name,
      type,
      roleDesc
    }
  });
}

const getRoles = async () => {
  return await prisma.role.findMany()
}

const getRoleById = async ( id: number) => {
  try {
    return await prisma.role.findFirstOrThrow ({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw "Role not found"
  }
}

const updateRoles = async ( id: number, name: string, type: string, roleDesc: string) => {
  return await prisma.role.update ({
    where: {
      id: Number(id),
    },
    data: {
      name: name,
      type: type,
      roleDesc: roleDesc,
    },
  });
}

const deleteRole = async (id: number) => {
  return await prisma.role.delete({
    where: {
      id: Number(id),
    },
  });  
}

export { createRole, getRoles, getRoleById, updateRoles, deleteRole}