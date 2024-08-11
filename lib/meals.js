import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

import fs from "node:fs";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal({ meal }) {
  meal.slug = slugify(meal.name, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const streem = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  streem.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving Image failed");
    }
  });

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
    
    INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email
    VALUES ( @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
    )
    `
  ).run(meal);
}
