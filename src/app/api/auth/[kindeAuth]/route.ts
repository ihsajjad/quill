import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { z } from "zod";
export const GET = (request: NextRequest, { params }: { params: any }) => {
  const endpoint = params.kindeAuth;
  return handleAuth(request, endpoint);
};
