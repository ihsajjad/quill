// import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export async function GET(
  request: any,
  { params }: { params: { kindeAuth: string } }
) {
  const endpoint = params.kindeAuth;
  const myFunc = await handleAuth(request, endpoint);
  return myFunc;
}

// export const GET = (
//   request: NextRequest,
//   { params }: { params: { kindeAuth?: string } }
// ): Promise<void | NextResponse<unknown>> => {
//   const endpoint = params.kindeAuth;
//   return handleAuth(request, endpoint);
// };
