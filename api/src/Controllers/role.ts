import { createRole, deleteRole, getRoleById, getRoles, updateRole } from "../Models/role";
import Utility from "./Utility";

const roleControllers ={
  async createRole(req: any, res: any) {
    const { name, type, roleDesc, nightTimePrompt } = req.body;
		if (Utility.validateInputs(res, "Invalid body parameters", name, type, roleDesc, nightTimePrompt)) {
			const role = await createRole(name, type, roleDesc, nightTimePrompt);
			res.status(201).json(role);
		}
  },

  async getRoles(req: any, res: any) {
    const roles = await getRoles();
    res.json(roles);
  },

  async getSingleRole(req: any, res: any) {
    const { id } = req.params;

    try {
      const role = await getRoleById(id);
      res.json(role);
    } catch (error) {
      return res.status(404).json({ error: "Role not found"})
    }
  },

  async updateRoles(req: any, res: any) {
    const { id, name, type, roleDesc, nightTimePrompt } = req.body
    const updatedRoles = await updateRole(id, name, type, roleDesc, nightTimePrompt);
    res.json(updatedRoles);
  },

  async deleteRole(req: any, res: any) {
    const id = req.params.id;

		if (Utility.validateInputs(res, "Invalid id", id)) {
			const deletedRole = await deleteRole(id);
			res.json(deletedRole);
		}
  },
}

export default roleControllers;