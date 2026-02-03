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
    twoFactorEnabled
    twoFactorConfirmedAt
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
query FindAllRoles($params: RolePaginatedInput!) {
  findAllRoles(params: $params) {
    total
    data {
      createdAt
      description
      id
      name
      resellerId
      updatedAt
    }
  }
}
`;

export const CREATE_USER = `
mutation CreateUser($data: UserCreateInputDTO!) {
  createUser(data: $data) {
    id
  }
}
`;

export const UPDATE_USER = `
mutation UpdateUser($input: UserUpdateInput!) {
  updateUser(input: $input)
}
`;

export const CHANGE_PASSWORD = `
mutation ChangePassword($input: UserChangePasswordInput!) {
  changePassword(input: $input)
}
`;

export const USERS = `
query FindAllUsers($params: UserPaginatedInput!) {
  findAllUsers(params: $params) {
    activeCount
    adminCount
    userCount
    data {
      active
      contactNo
      countryCode
      createdAt
      email
      id
      lastLogin
      roleIds
      resellerId
      roles {
        id
        name
        resellerId
        createdAt
      }
      type
      updatedAt
      username
    }
    total
  }
}
`;

export const FORGOT_PASSWORD = `
mutation ForgotPassword($input: ForgotPasswordInput!) {
  forgotPassword(input: $input)
}
`;

export const RESET_PASSWORD = `
mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input)
}
`;
