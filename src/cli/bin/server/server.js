/* Server Dependencies */
const server = require("server");
const path = require("path");
const { render, file } = require("server/reply");
const { get, error } = server.router;
const boxen = require("boxen");
const fs = require("fs");

const appDir = process.cwd();

function serve(cwp, port = 5000, root = "index.html", errorCount = 0) {
  const oldCwp = cwp;
  const oldRoot = root;
  cwp = path.join(appDir, cwp ?? "");
  root = path.join(cwp, root);
  if (!fs.existsSync(root)) {
    return console.error(`\x1b[31m${oldRoot} cannot be found.`);
  }
  server({ view: "view", port: port }, [
    get("/", (ctx) => render(root)),
    get("/*.*", (ctx) => {
      return file(path.join(cwp, ctx.url));
    }),
    get((ctx) => render(root)),
    error((err) => render(root)),
  ])
    .then(() => {
      console.info(
        boxen(`\x1b[36mStarted server at http://localhost:${port}\x1b[0m`, {
          padding: 1,
          borderStyle: "double",
        })
      );
    })
    .catch((e) => {
      if (e.errno === -98 && errorCount < 5)
        serve(oldCwp, port + 1, oldRoot, errorCount + 1);
      else console.error(e);
    });
}

module.exports = {
  serve: serve,
};
