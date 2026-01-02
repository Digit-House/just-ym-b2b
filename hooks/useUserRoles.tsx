import { useQuery } from "@tanstack/react-query";
import { warpGql } from "@/util";
import client from "@/graphql/client";
import { USER_ROLES } from "@/graphql/type-query/user";
import { UserRolesFilterT } from "@/types/user.type";

export const useUserRoles = ({
  limit = 10,
  page = 1,
  orderBy = { dir: "desc" },
  resellerId,
}: Omit<UserRolesFilterT,"active"|"type">) => {
  return useQuery({
    queryKey: ["user-roles", limit, page, orderBy.dir, resellerId],
    queryFn: async () => {
      const { data }: any = await client.query({
        query: warpGql(USER_ROLES),
        variables: {
          params: {
            limit,
            page,
            orderBy,
            resellerId,
          },
        },
      });
      return data?.findAllRoles?.data;
    },
  });
};
