import { Schema, model, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String, trim: true, default: "" },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type Project = InferSchemaType<typeof projectSchema>;

export default model("Project", projectSchema);