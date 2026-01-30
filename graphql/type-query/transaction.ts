export const CREDIT_LOGS = `
query FindAllCreditLogs($params: CreditLogPagedParams!) {
  findAllCreditLogs(params: $params) {
    total
    data {
      id
      amount
      type
      createdAt
      updatedAt
      actionLog {
        type
        txn {
          id
        }
        topUpId
        createdAt
      }
      credit {
        reseller {
          email
        }
      }
    }
  }
}
`