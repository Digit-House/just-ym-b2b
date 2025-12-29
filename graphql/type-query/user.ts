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