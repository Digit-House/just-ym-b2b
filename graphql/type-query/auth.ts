export const LOGIN = `
mutation Login($email: String!, $password: String!, $site: Site) {
  login(email: $email, password: $password, site: $site) {
    id
    accessToken
    active
  }
}
`;
