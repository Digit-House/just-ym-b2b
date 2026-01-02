export const GET_PRESIGNED_URL = `query Query($input: GetPresignedPostInput!) {
    getPresignedPost(input: $input) {
      fields
      url
    }
  }`;
