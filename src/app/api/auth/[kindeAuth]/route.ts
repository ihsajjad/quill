import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = () => handleAuth();

// export const GET = (
//   request: NextRequest,
//   { params }: { params: { kindeAuth?: string } }
// ): Promise<void | NextResponse<unknown>> => {
//   const endpoint = params.kindeAuth;
//   return handleAuth(request, endpoint);
// };
