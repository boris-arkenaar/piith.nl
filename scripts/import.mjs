/* eslint-disable no-console */

import { join } from "path";
import fs from "fs";
import { parseStringPromise } from "xml2js";
import { formatISO, parseJSON } from "date-fns";

const articlesFile = join(
  process.cwd(),
  "import/piith.WordPress.2023-03-05.xml"
);
const imagesFile = join(process.cwd(), "import/images.json");
const imagesDir = join(process.cwd(), "import/images");
const uploadsDir = join(process.cwd(), "import/uploads");
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
      const title = item.title[0].trim().replaceAll('"', '\\"');
      const tempDate = formatISO(parseJSON(item["wp:post_date"][0]));
      const date = tempDate.substring(0, 19);

      // Extract images from content
      const imageResults = [...content.matchAll(imageRegexp)].map(
        (match) => match[1]
      );
      imageResults.forEach(images.add, images);

      // Create markdown file
      const slug = link.replace("http://piith.nl/", "").replace("/", "");
      const filename = `${date}_${slug}.md`;
      const filepath = join(process.cwd(), "content", "articles", filename);
      const frontmatter = `---
title: "${title}"
date: ${date}Z
alias: /${slug}/
---
`;
      fs.writeFileSync(filepath, frontmatter + content);
    }

    // Save image list to file
    const imagesArray = Array.from(images);
    fs.writeFileSync(imagesFile, JSON.stringify(imagesArray, null, 2));

    let imagesFailed = [];

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
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.debug(dir);
      } catch (error) {
        console.debug("FAILED to copy: ", sourcePath);
        imagesFailed.push(sourcePath);
      }
    }

    console.log("Import complete");

    if (imagesFailed.length) {
      console.log("The following images failed to copy:");
      imagesFailed.forEach((image) => console.log(image));
    }
  } catch (error) {
    console.error("Import error", error);
  }
}

await importArticles();
