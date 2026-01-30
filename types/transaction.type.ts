export type TransactionT = {
  amount: number;
  id: string;
  type: "MINUS" | "PLUS";
  createdAt: string;
  updatedAt: string;
  actionLog: {
    type:
      | "ADMIN_SALE"
      | "AGENT_SALE"
      | "CUSTOMER_SALE"
      | "GT_TOP_UP"
      | "TOP_UP";
    txn: {
      id: string;
    };
    topUpId: string;
    createdAt: string;
  };
  credit: {
    reseller: {
      name: string;
      email: string;
    };
  };
};

export type TransactionFilterT = {
  included_credits: "CUSTOMER" | "GT_BALANCE" | "GT_BALANCE_MAIN" | "MAIN";
  page: number;
  limit: number;
  orderBy: {
    dir: "asc" | "desc";
    field: "updatedAt";
  };
};
