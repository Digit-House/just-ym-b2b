import { warpGql } from "@/util";
import client from "./client";
import {
  LOGOUT,
  LOGOUT_ALL_SESSIONS,
  MY_SESSIONS,
  REVOKE_SESSION,
} from "./type-query/session";

export type SessionStatusFilter = "ALL" | "ACTIVE" | "EXPIRED" | "REVOKED";

export type SessionT = {
  id: string;
  platform: "WEB" | "IOS" | "ANDROID";
  deviceType?: string | null;
  deviceName?: string | null;
  deviceModel?: string | null;
  osVersion?: string | null;
  appVersion?: string | null;
  city?: string | null;
  country?: string | null;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  isCurrent: boolean;
  expiresAt: string;
  lastSeenAt?: string | null;
  createdAt: string;
};

export const getMySessions = async (status: SessionStatusFilter = "ACTIVE") => {
  return client.query<{ mySessions: SessionT[] }>({
    query: warpGql(MY_SESSIONS),
    variables: { status },
    fetchPolicy: "no-cache",
  });
};

export const logoutSession = async () => {
  return client.mutate({ mutation: warpGql(LOGOUT) });
};

export const revokeSession = async (sessionId: string) => {
  return client.mutate({
    mutation: warpGql(REVOKE_SESSION),
    variables: { sessionId },
  });
};

// returns the number of sessions revoked
export const logoutAllSessions = async (includeSelf = false) => {
  return client.mutate<{ logoutAllSessions: number }>({
    mutation: warpGql(LOGOUT_ALL_SESSIONS),
    variables: { includeSelf },
  });
};
