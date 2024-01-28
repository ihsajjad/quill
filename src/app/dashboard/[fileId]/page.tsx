import ChatWrapper from "@/components/chat/ChatWrapper";
import PDFRenderer from "@/components/PDFRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  // retrive the file id
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user?.email)
    redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findFirst({
    where: { id: fileId, userId: user?.id },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 flex flex-col justify-between h-[calc(100vh-3.5rem)] ">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={file.url} />
          </div>
        </div>

        {/* right side */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
