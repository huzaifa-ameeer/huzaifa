import app from "./index";
import net from "node:net";

const requestedPort = Number(process.env.PORT) || 5000;

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = findAvailablePort(port + 1);
      nextPort.then((availablePort) => startServer(availablePort)).catch((scanError) => {
        console.error("Unable to find an available port:", scanError);
        process.exitCode = 1;
      });
      return;
    }

    console.error("Server failed to start:", error);
    process.exitCode = 1;
  });
}

function findAvailablePort(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();

    probe.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        resolve(findAvailablePort(port + 1));
      } else {
        reject(error);
      }
    });

    probe.once("listening", () => {
      probe.close(() => resolve(port));
    });

    probe.listen(port);
  });
}

startServer(requestedPort);
