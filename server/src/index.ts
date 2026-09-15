import { app } from "./app.js";
import { port } from "./db/pool.js";

app.listen(port, () => {
  console.log(`API Inklusia berjalan di http://localhost:${port}`);
});
