import bcrypt from "bcryptjs";
import Blog from "../models/Blog";
import User from "../models/User";
import Project from "../models/Project";

const sampleBlogs = [
  {
    title: "Getting Started with React",
    content:
      "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components.\n\nComponents accept inputs called props and return what should appear on the screen. Functions or classes, components keep your UI modular and reusable.\n\nState is another core concept. It holds data that changes over time, and whenever state updates, React re-renders the affected parts of the UI efficiently.\n\nStart small: build a single component, add props, introduce state, and soon you will be organizing whole applications into component trees.",
  },
  {
    title: "Why I Choose MongoDB for My Backends",
    content:
      "When your schema evolves quickly, a document model removes the friction of constant migrations. MongoDB stores data in flexible, JSON-like documents.\n\nFor rapid prototyping, this is a huge win. You can add fields to a document without touching every existing record.\n\nPaired with Mongoose on the backend, MongoDB makes it easy to define schemas, validate data, and query nested structures with a familiar API.\n\nThat is why MongoDB remains my go-to choice for most MERN stack projects.",
  },
  {
    title: "Understanding JWT Authentication",
    content:
      "A JSON Web Token is a compact, URL-safe token used to represent claims securely between two parties.\n\nA JWT is made of three parts: a header, a payload, and a signature. The signature is created by hashing the header and payload with a secret key.\n\nThe server verifies the signature on every request, so it can trust the identity of whoever holds the token without storing session data.\n\nUse short-lived access tokens and a refresh token strategy to keep your application secure while preserving a smooth user experience.",
  },
  {
    title: "Building and Shipping APIs with Docker",
    content:
      "Docker packages your application and its dependencies into a container that runs the same way anywhere.\n\nA Dockerfile describes how to build the image: base image, dependencies, and the command to start your server.\n\nCompose lets you run your API, database, and other services together with a single command, which is perfect for local development.\n\nOnce images are built, deploying is just a matter of pulling and running them on any container host.",
  },
];

export async function seedBlogsIfEmpty() {
  const count = await Blog.estimatedDocumentCount();
  if (count > 0) return;

  await Blog.insertMany(sampleBlogs);
  console.log(`Seeded ${sampleBlogs.length} blogs`);
}

const sampleProjects = [
  {
    name: "E-Commerce Store",
    github: "https://github.com/yourusername/ecommerce-store",
    live: "",
    content:
      "A full-featured e-commerce platform with cart, checkout, and payment integration.",
  },
  {
    name: "Task Manager",
    github: "",
    live: "https://task-manager.example.com",
    content:
      "A collaborative task management app with real-time updates and team boards.",
  },
  {
    name: "Chat Application",
    github: "https://github.com/yourusername/chat-application",
    live: "",
    content:
      "A real-time chat app with direct messages, rooms, and push notifications.",
  },
  {
    name: "Analytics Dashboard",
    github: "https://github.com/yourusername/analytics-dashboard",
    live: "https://analytics.example.com",
    content:
      "A data visualization dashboard with charts, reports, and exportable insights.",
  },
];

export async function seedProjectsIfEmpty() {
  const count = await Project.estimatedDocumentCount();
  if (count > 0) {
    await migrateProjectLinks();
    return;
  }

  await Project.insertMany(sampleProjects);
  console.log(`Seeded ${sampleProjects.length} projects`);
}

export async function migrateProjectLinks() {
  const old = await Project.find({
    link: { $exists: true, $ne: "" },
  });
  if (old.length === 0) return;

  let migrated = 0;
  for (const project of old) {
    const url = (project.get("link") as string) || "";
    const update: { github: string; live: string; link?: undefined } = {
      github: url.includes("github.com") ? url : "",
      live: url.includes("github.com") ? "" : url,
      link: undefined,
    };
    await project.set(update).save();
    migrated++;
  }
  console.log(`Migrated ${migrated} project link(s) to github/live`);
}

const adminEmail = "huzaifaameer098@gmail.com";
const adminPassword = "huzaifa@786";

export async function seedAdminIfMissing() {
  const existing = await User.findOne({ email: adminEmail });
  if (existing) return;

  const hashed = await bcrypt.hash(adminPassword, 10);
  await User.create({
    email: adminEmail,
    password: hashed,
    role: "admin",
  });
  console.log(`Seeded admin user: ${adminEmail}`);
}