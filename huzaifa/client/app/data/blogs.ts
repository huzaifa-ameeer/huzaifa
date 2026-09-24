export type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content: string[];
};

export const blogs: Blog[] = [
  {
    slug: "getting-started-with-react",
    title: "Getting Started with React",
    excerpt:
      "A beginner-friendly guide to understanding React components, props, and state.",
    image: "https://picsum.photos/seed/blog-one/600/400",
    date: "Jan 12, 2026",
    content: [
      "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components.",
      "Components accept inputs called props and return what should appear on the screen. Functions or classes, components keep your UI modular and reusable.",
      "State is another core concept. It holds data that changes over time, and whenever state updates, React re-renders the affected parts of the UI efficiently.",
      "Start small: build a single component, add props, introduce state, and soon you will be organizing whole applications into component trees.",
    ],
  },
  {
    slug: "why-i-choose-mongodb",
    title: "Why I Choose MongoDB for My Backends",
    excerpt:
      "The flexibility of a document database and how it fits into my MERN workflow.",
    image: "https://picsum.photos/seed/blog-two/600/400",
    date: "Feb 3, 2026",
    content: [
      "When your schema evolves quickly, a document model removes the friction of constant migrations. MongoDB stores data in flexible, JSON-like documents.",
      "For rapid prototyping, this is a huge win. You can add fields to a document without touching every existing record.",
      "Paired with Mongoose on the backend, MongoDB makes it easy to define schemas, validate data, and query nested structures with a familiar API.",
      "That is why MongoDB remains my go-to choice for most MERN stack projects.",
    ],
  },
  {
    slug: "understanding-jwt-authentication",
    title: "Understanding JWT Authentication",
    excerpt:
      "How JSON Web Tokens work, from signing to verifying, and where they fit in auth flows.",
    image: "https://picsum.photos/seed/blog-three/600/400",
    date: "Mar 18, 2026",
    content: [
      "A JSON Web Token is a compact, URL-safe token used to represent claims securely between two parties.",
      "A JWT is made of three parts: a header, a payload, and a signature. The signature is created by hashing the header and payload with a secret key.",
      "The server verifies the signature on every request, so it can trust the identity of whoever holds the token without storing session data.",
      "Use short-lived access tokens and a refresh token strategy to keep your application secure while preserving a smooth user experience.",
    ],
  },
  {
    slug: "building-apis-with-docker",
    title: "Building and Shipping APIs with Docker",
    excerpt:
      "Containerizing your backend for consistent environments from development to production.",
    image: "https://picsum.photos/seed/blog-four/600/400",
    date: "Apr 9, 2026",
    content: [
      "Docker packages your application and its dependencies into a container that runs the same way anywhere.",
      "A Dockerfile describes how to build the image: base image, dependencies, and the command to start your server.",
      "Compose lets you run your API, database, and other services together with a single command, which is perfect for local development.",
      "Once images are built, deploying is just a matter of pulling and running them on any container host.",
    ],
  },
];