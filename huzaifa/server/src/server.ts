import app from "./index";

const port = Number(process.env.PORT) || 8001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
