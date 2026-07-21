import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    es: z.object({
      date: z.string(),
      title: z.string(),
      excerpt: z.string()
    }),
    en: z.object({
      date: z.string(),
      title: z.string(),
      excerpt: z.string()
    }),
    pubDate: z.date()
  })
});

const albums = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    releaseDate: z.coerce.date(),
    published: z.boolean().default(true),
    current: z.boolean().default(false),
    descriptionEs: z.string(),
    descriptionEn: z.string(),
    tracks: z.array(
      z.object({
        num: z.string(),
        title: z.string(),
        duration: z.string(),
        single: z.boolean().default(false)
      })
    )
  })
});

export const collections = { blog, albums };
