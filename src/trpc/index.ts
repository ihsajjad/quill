import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcidure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase.config";

// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "@/lib/pinecone";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.email || !user?.id)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),
  getUserFiles: privateProcidure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({ where: { userId } });
  }),
  getFileUploadStatus: privateProcidure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: { id: input.fileId, userId },
      });

      if (!file) return { status: "PENDING" };

      return { status: file.uploadStatus };
    }),
  getFile: privateProcidure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: { key: input?.key, userId },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
  uploadFile: privateProcidure
    .input(z.object({ key: z.string(), name: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const createdFile = await db.file.create({
        data: {
          key: input.key,
          name: input.name,
          userId,
          url: input.url,
          uploadStatus: "PROCESSING",
        },
      });

      // const fileRef = ref(storage, input.url);

      // await getDownloadURL(fileRef)
      //   .then((downloadURL) => {
      //     return fetch(downloadURL);
      //   })
      //   .then((res) => res.blob())
      //   .then(async (blob) => {
      //     const loader = new PDFLoader(blob);

      //     const pageLevelDocs = await loader.load();
      //     const pageAmt = pageLevelDocs.length;

      //     // vectorize and index entire document
      //     const embeddings = new OpenAIEmbeddings();
      //   });

      try {
        const loader = new CheerioWebBaseLoader(input.url);

        const pageLevelDocs = await loader.load();
        const pagesAmt = pageLevelDocs.length;

        const spliter = new RecursiveCharacterTextSplitter();

        const spliteDocs = await spliter.splitDocuments(pageLevelDocs);

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        // vectorize and index entire document
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        console.log(error);
        await db.file.update({
          data: { uploadStatus: "FAILED" },
          where: { id: createdFile.id },
        });
      }

      return createdFile;
    }),
  deleteFile: privateProcidure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({ where: { id: input.id, userId } });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({ where: { id: input.id } });

      return file;
    }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
