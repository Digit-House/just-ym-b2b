import { useUser } from "@/provider/UserProvider";

type Props = {
  isAllowed?: boolean;
  children: React.ReactNode;
  infoNode?: React.ReactNode;
};

const RoleCheckAction = ({ isAllowed = false, children, infoNode }: Props) => {
  const { user } = useUser();

  if (!["ADMIN", "RESELLER"].includes(user.roles[0].name) && !isAllowed) {
    return infoNode ? infoNode : null;
  }

  return <>{children}</>;
};

export default RoleCheckAction;
