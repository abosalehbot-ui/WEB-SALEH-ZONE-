import app from "./app";

const port = Number(process.env.PORT) || 8080;
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Saleh Zone backend listening on http://${host}:${port}`);
});
