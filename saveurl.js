import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "urls.json");

export function saveUrl(url) {
  let urls = [];

  if (fs.existsSync(FILE)) {
    urls = JSON.parse(fs.readFileSync(FILE, "utf8"));
  }

  urls.push({
    url,
    processed: new Date().toISOString(),
  });

  fs.writeFileSync(FILE, JSON.stringify(urls, null, 2));
}
