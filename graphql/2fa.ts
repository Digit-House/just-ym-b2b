import { warpGql } from "@/util";
import client from "./client";
import {
  CONFIRM_TWO_FACTOR_SETUP,
  DISABLE_TWO_FACTOR,
  START_TWO_FACTOR_SETUP,
} from "./type-query/2fa";


export const startTwoFactorSetup = async () => {
  return client.mutate({
    mutation: warpGql(START_TWO_FACTOR_SETUP),
  });
};
//res => data?.startTwoFactorSetup?.otpauthUrl => qrcodeurl go to google authenticator


export const confirmTwoFactorSetup = async (code: string) => {
  return client.mutate({
    mutation: warpGql(CONFIRM_TWO_FACTOR_SETUP),
    variables: {
      input: {
        code,
      },
    },
  });
};
//res => data?.confirmTwoFactorSetup?.backupCodes : string[]

export const disableTwoFactor = async (code: string) => {
  return client.mutate({
    mutation:warpGql(DISABLE_TWO_FACTOR),
    variables:{
      input: {
        code,
      },
    }
  })
}
//res => data?.disableTwoFactor : boolean