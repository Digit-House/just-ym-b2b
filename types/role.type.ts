import { FilterT } from "./index.type";

export interface RoleFilterT extends FilterT {
    resellerId:string|null;
}

export type RoleT = {
  createdAt:string;
 
  id:string;
  name:string;
  description:string;
  resellerId:string;
  updatedAt:string;
};
