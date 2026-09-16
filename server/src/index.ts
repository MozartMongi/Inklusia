import { app } from "./app.js";
import { port } from "./db/pool.js";

app.listen(port, "0.0.0.0", () => {
  console.log(`API Inklusia berjalan di port ${port}`);
});
