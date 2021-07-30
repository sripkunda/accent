const fs = require("fs")
const path = require("path")

/* 
    --project
        --pages
            --shared
        --components
            --shared
        - index.html
        - app.js
        - ac.config.js
*/ 

function create(name, filepath) {
    dir = path.join(filepath, name); 
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    if (fs.existsSync(path.join(dir, "ac.config.json"))) throw `Project ${name} already exists!`;

    const makeSection = (p) => {
        p = path.join(dir, p); 
        fs.mkdirSync(p);
        fs.mkdirSync(path.join(p, "shared"));
    }

    const writeTemplate = (t) => {
        fs.readFile(path.join(__dirname, "templates", t), (e, d) => {
            if (e) throw e;
            const data = d.toString();
            fs.writeFileSync(path.join(dir, t), data);
        });
    }

    makeSection("pages");
    makeSection("components"); 
    writeTemplate("index.html");
    writeTemplate("app.js");
    writeTemplate("ac.config.json");

    return dir;
}

module.exports = {
    create: create
}