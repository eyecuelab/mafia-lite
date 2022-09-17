import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createRole = async (name: string, type: string, roleDesc: string, nightTimePrompt: string) => {
  return await prisma.role.create ({
    data: {
      name,
      type,
      nightTimePrompt,
      roleDesc
    }
  });
}

const getRoles = async () => {
  return await prisma.role.findMany()
}

const getRoleById = async (id: number | null) => {
	if (!id) {
		return null;
	}
  try {
    return await prisma.role.findFirstOrThrow ({
      where: { id: Number(id) },
    });
  } catch (error) {
    if (error instanceof Error)
    throw (error.message)
    }
  }


const getRolesbyType = async (type: string) => {
	return await prisma.role.findMany({
		where: {
			type: type
		}
	})
}

const getRoleByName = async (name: string) => {
  return await prisma.role.findFirst({
    where: { name: name }
  });
}

const updateRole = async ( id: number, name: string, type: string, roleDesc: string, nightTimePrompt: string) => {
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

export { createRole, getRoles, getRoleById, updateRole, deleteRole, getRolesbyType, getRoleByName }