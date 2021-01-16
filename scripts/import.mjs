/* eslint-disable no-console */

import dateFns from "date-fns";
import fs from "fs";
import { join } from "path";
import convert from "xml-js";

const file = join(process.cwd(), "scripts/articles.xml");
const xml = fs.readFileSync(file, "utf8");
const options = { ignoreComment: false, compact: true, trim: true };
const result = convert.xml2js(xml, options);

console.log();

result.rss.channel.item.forEach(
  ({ title, link, "wp:post_date_gmt": date, "content:encoded": content }) => {
    const improvedContent = content._cdata.replace(
      "http://piith.nl/wp-content/uploads/",
      "/uploads/"
    );
    const dateString = dateFns.formatISO(dateFns.parseJSON(date._cdata));
    const slug = link._text.replace("http://piith.nl/", "").replace("/", "");
    const fileName = `${slug}.md`;
    const fileContent = `---\ntitle: "${title._text}"\ndate: ${dateString}\n---\n\n${improvedContent}`;
    const file = join(process.cwd(), "content", "articles", fileName);
    fs.writeFileSync(file, fileContent);
    console.log(file);
  }
);

console.log();
