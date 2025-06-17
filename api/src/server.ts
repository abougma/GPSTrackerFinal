import app from "./app";

const HTTP_PORT = 3000;
app.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
});
