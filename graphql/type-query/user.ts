export const Me = `
query Me {
  me {
    active
    contactNo
    countryCode
    createdAt
    email
    id
    imageURI
    lastLogin
    profileData {
      dateOfBirth
      email
      firstName
      gender
      lastName
      nationality
      phoneNumber
      profilePicture
    }
    roleIds
    roles {
      createdAt
      description
      id
      name
      resellerId
      updatedAt
    }
    type
    updatedAt
    username
    providers
  }
}
`;

export const USER_ROLES = `
query Data($params: RolePaginatedInput!) {
  findAllRoles(params: $params) {
    data {
      createdAt
      description
      id
      name
      resellerId
      updatedAt
    }
    total
  }
}
`

export const CREATE_USER = `
mutation CreateUser($data: UserCreateInputDTO!) {
  createUser(data: $data) {
    id
  }
}
`;

export const USERS = `
query FindAllUsers($params: UserPaginatedInput!) {
  findAllUsers(params: $params) {
    total
    data {
      active
      contactNo
      countryCode
      createdAt
      email
      id
      imageURI
      lastLogin
      providers
      roleIds
      roles {
        id
        name
        resellerId
      }
      type
      updatedAt
      username
    }
  }
}
`