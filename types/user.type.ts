export type ProfileDataT = {
  dateOfBirth: string;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
  nationality: string;
  phoneNumber: string;
  profilePicture: string;
};

export type UserT = {
  active: boolean;
  contactNo: string;
  countryCode: string;
  createdAt: string;
  email: string;
  id: string;
  imageURI: string;
  lastLogin: string;
  profileData: ProfileDataT;
  roleIds:string[];
  type:"OWNER"|"RESELLER"|"USER",
  updatedAt:string;
  username:string;
};
