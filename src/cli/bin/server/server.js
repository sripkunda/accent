/* Server Dependencies */
const server = require("server");
const path = require("path");
const { render, file } = require("server/reply");
const { get, error } = server.router;
const boxen = require("boxen");

const appDir = process.cwd();

function serve(cwp, port = 5000, root = "index.html") {
  cwp = path.join(appDir, cwp ?? "");
  root = path.join(cwp, root);
  server({ view: "view", port: port }, [
    get("/", (ctx) => render(root)),
    get("/*.*", (ctx) => {
      return file(path.join(cwp, ctx.url));
    }),
    get("/*.html", (ctx) => {
      return render(path.join(cwp, ctx.url));
    }),
    get((ctx) => render(root)),
    error((err) => render(root)),
  ]).then(() => {
    console.info(
      boxen(`\x1b[36mStarted server at http://localhost:${port}\x1b[0m`, {
        padding: 1,
        borderStyle: "double",
      })
    );
  });
}

module.exports = {
  serve: serve,
};
