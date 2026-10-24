export const MY_SESSIONS = `
query MySessions($status: SessionStatusFilter) {
  mySessions(status: $status) {
    id
    platform
    deviceType
    deviceName
    deviceModel
    osVersion
    appVersion
    city
    country
    status
    isCurrent
    expiresAt
    lastSeenAt
    createdAt
  }
}
`;

export const LOGOUT = `
mutation Logout {
  logout
}
`;

export const REVOKE_SESSION = `
mutation RevokeSession($sessionId: String!) {
  revokeSession(sessionId: $sessionId)
}
`;

export const LOGOUT_ALL_SESSIONS = `
mutation LogoutAllSessions($includeSelf: Boolean) {
  logoutAllSessions(includeSelf: $includeSelf)
}
`;
