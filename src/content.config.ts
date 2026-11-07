import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// PROYECTOS: un .md por proyecto en src/content/projects/
// - frontmatter: datos de la fila + "summary" (lo que se ve al desplegar en la home)
// - cuerpo del .md: la explicación larga que aparece en la página del proyecto
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    year: z.number(),
    tags: z.array(z.string()),
    status: z.enum(["active", "developing", "exploring", "research", "paused", "finished"]),
    beforeWebsite: z.boolean().default(false),
    summary: z.string(),
    featured: z.boolean().default(false),
    links: z
      .object({
        github: z.string().optional(),
        demo: z.string().optional(),
      })
      .optional(),
  }),
});

// DIARIO: una entrada = un .md dentro de la carpeta del proyecto
//   src/content/log/<id-del-proyecto>/2026-11-07.md
// El nombre de la carpeta debe coincidir con el nombre del .md del proyecto.
const log = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/log" }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    type: z.enum(["progress", "problem", "decision", "milestone"]).default("progress"),
  }),
});

export const collections = { projects, log };
