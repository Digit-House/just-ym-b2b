export const START_TWO_FACTOR_SETUP = `
mutation StartTwoFactorSetup {
  startTwoFactorSetup {
    otpauthUrl
  }
}
`;

export const CONFIRM_TWO_FACTOR_SETUP = `
mutation ConfirmTwoFactorSetup($input: TwoFactorCodeInput!) {
  confirmTwoFactorSetup(input: $input) {
    backupCodes
  }
}
`;

export const DISABLE_TWO_FACTOR = `
mutation DisableTwoFactor($input: TwoFactorCodeInput!) {
  disableTwoFactor(input: $input)
}
`;
