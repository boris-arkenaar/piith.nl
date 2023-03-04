/* eslint-disable no-console */

/*
import dateFns from "date-fns";
import fs from "fs";
import { join } from "path";
import convert from "xml-js";

const file = join(process.cwd(), "scripts/articles.xml");
const xml = fs.readFileSync(file, "utf8");
const options = { ignoreComment: false, compact: true, trim: true };
const result = convert.xml2js(xml, options);
let images = [];
const imageRegexp =
  /src="https:\/\/res.cloudinary.com\/piith\/image\/upload\/(.*?)"/g;

console.log();

result.rss.channel.item.forEach(
  ({ title, link, "wp:post_date_gmt": date, "content:encoded": content }) => {
    const improvedContent = content._cdata.replace(
      "http://piith.nl/wp-content/uploads/",
      "https://res.cloudinary.com/piith/image/upload/"
    );
    const imageResults = [...improvedContent.matchAll(imageRegexp)].map(
      (match) => match[1]
    );
    images = [...images, ...imageResults];
    const dateString = dateFns.formatISO(dateFns.parseJSON(date._cdata));
    const slug = link._text.replace("http://piith.nl/", "").replace("/", "");
    const fileName = `${slug}.md`;
    const fileContent = `---\ntitle: "${title._text}"\ndate: ${dateString}\n---\n\n${improvedContent}`;
    const file = join(process.cwd(), "content", "articles", fileName);
    fs.writeFileSync(file, fileContent);
    console.log(file);
  }
);

console.log(images);

console.log();

*/

import { join } from "path";
import fs from "fs";
import { parseStringPromise } from "xml2js";
import dateFns from "date-fns";

const articlesFile = join(process.cwd(), "scripts/articles.xml");
const imagesFile = join(process.cwd(), "import/images.json");
const imagesDir = join(process.cwd(), "import/images");
const uploadsDir = join(process.cwd(), "public/uploads");
const imageRegexp =
  /src="https:\/\/res.cloudinary.com\/piith\/image\/upload\/(.*?)"/g;

async function importArticles() {
  try {
    // Read WordPress backup file
    const data = fs.readFileSync(articlesFile);
    const { rss } = await parseStringPromise(data);

    // Initialize image set
    const images = new Set();

    // Iterate over articles
    for (const item of rss.channel[0].item) {
      const link = item.link[0];
      console.log(`Processing article ${link}`);

      // Update image and link URLs
      const content = item["content:encoded"][0]
        .trim()
        .replace(
          /http:\/\/piith.nl\/wp-content\/uploads\//g,
          "https://res.cloudinary.com/piith/image/upload/"
        )
        .replace(/http:\/\/piith.nl/g, "https://piith.nl");

      // Extract title and date
      const title = item.title[0].trim();
      const date = dateFns.formatISO(
        dateFns.parseJSON(item["wp:post_date_gmt"][0])
      );

      // Extract images from content
      const imageResults = [...content.matchAll(imageRegexp)].map(
        (match) => match[1]
      );
      imageResults.forEach(images.add, images);

      // Create markdown file
      const slug = link.replace("http://piith.nl/", "").replace("/", "");
      const filename = `${slug}.md`;
      const filepath = join(process.cwd(), "content", "articles", filename);
      const frontmatter = `---
title: "${title}"
date: ${date}
---
`;
      fs.writeFileSync(filepath, frontmatter + content);
    }

    // Save image list to file
    const imagesArray = Array.from(images);
    fs.writeFileSync(imagesFile, JSON.stringify(imagesArray, null, 2));

    // Copy images
    for (const imagePath of imagesArray) {
      const sourcePath = join(uploadsDir, imagePath);
      const destPath = join(imagesDir, imagePath);
      const lastSlash = imagePath.lastIndexOf("/");
      const dir = join(imagesDir, imagePath.substring(0, lastSlash));
      console.debug(dir);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, destPath);
    }

    console.log("Import complete");
  } catch (error) {
    console.error("Import error", error);
  }
}

await importArticles();
