import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  //   environment: "gcp-starter",
});

export const pineconeIndex = pinecone.index("quill");
