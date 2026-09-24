export type Project = {
  name: string;
  description: string;
  liveLink: string;
  image: string;
};

export const projects: Project[] = [
  {
    name: "E-Commerce Store",
    description:
      "A full-featured e-commerce platform with cart, checkout, and payment integration.",
    liveLink: "https://example.com/project-one",
    image: "https://picsum.photos/seed/project-one/600/400",
  },
  {
    name: "Task Manager",
    description:
      "A collaborative task management app with real-time updates and team boards.",
    liveLink: "https://example.com/project-two",
    image: "https://picsum.photos/seed/project-two/600/400",
  },
  {
    name: "Chat Application",
    description:
      "A real-time chat app with direct messages, rooms, and push notifications.",
    liveLink: "https://example.com/project-three",
    image: "https://picsum.photos/seed/project-three/600/400",
  },
  {
    name: "Analytics Dashboard",
    description:
      "A data visualization dashboard with charts, reports, and exportable insights.",
    liveLink: "https://example.com/project-four",
    image: "https://picsum.photos/seed/project-four/600/400",
  },
];