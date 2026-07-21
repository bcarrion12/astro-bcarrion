import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'BCARRION — Andromeda',
    description: 'Notas y actualizaciones sobre Andromeda y bcarrion.',
    site: context.site,
    trailingSlash: false,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.es.title,
        description: post.data.es.excerpt,
        pubDate: post.data.pubDate,
        link: `/blog/${post.slug}`
      }))
  });
}
