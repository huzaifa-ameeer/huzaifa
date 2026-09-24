import { Schema, model, InferSchemaType } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type Blog = InferSchemaType<typeof blogSchema>;

export default model("Blog", blogSchema);