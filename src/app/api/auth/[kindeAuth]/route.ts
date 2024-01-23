import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
// export const GET = handleAuth();

export const GET = (request: NextRequest, { params }: any) => {
  const endpoint = params.kindeAuth;
  return handleAuth(request, endpoint);
};
