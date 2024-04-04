import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth();

// import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: Request | NextRequest,
//   { params }: { params: { kindeAuth: string } }
// ): Promise<void | NextResponse<unknown>> {
//   const endpoint = params.kindeAuth;
//   console.log(request);
//   return handleAuth(request, endpoint);
// }
