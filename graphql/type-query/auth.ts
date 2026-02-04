export const LOGIN = `
mutation Login($email: String!, $password: String!, $site: Site) {
  login(email: $email, password: $password, site: $site) {
    id
    accessToken
    active
    requiresTwoFactor
     twoFactorToken
  }
}
`;

export const LOGIN_WITH_TWO_FACTOR = `
mutation LoginWithTwoFactor($input: TwoFactorLoginInput!) {
  loginWithTwoFactor(input: $input) {
    id
    accessToken
    active
    requiresTwoFactor
  }
}
`;
