import { FilterT } from "./index.type";

export type USER_TYPE = "OWNER" | "RESELLER";

export const isAdmin = (role: USER_TYPE) => role === "OWNER";
export const isNotAdmin = (role: USER_TYPE) => role !== "OWNER";

export interface RoleFilterT extends FilterT {
  resellerId: string | null;
}

export type CreateRolePayload = {
  name: string;
  description: string;
  resellerId: string | null;
};

export type RoleT = {
  createdAt: string;
  id: string;
  name: string;
  description: string;
  resellerId: string;
  updatedAt: string;
};
