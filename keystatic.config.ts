import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    albums: collection({
      label: 'Álbumes',
      slugField: 'title',
      path: 'src/content/albums/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        releaseDate: fields.date({ label: 'Fecha de lanzamiento' }),
        published: fields.checkbox({
          label: 'Publicado',
          description: 'Si está destildado, no aparece en la web (ni en discografía ni en el hero).',
          defaultValue: true
        }),
        current: fields.checkbox({
          label: 'Álbum actual (hero de la home)',
          description: 'Marcá esta opción solo en el álbum que querés mostrar como lanzamiento vigente.',
          defaultValue: false
        }),
        descriptionEs: fields.text({ label: 'Descripción breve (ES)', multiline: true }),
        descriptionEn: fields.text({ label: 'Descripción breve (EN)', multiline: true }),
        tracks: fields.array(
          fields.object({
            num: fields.text({ label: 'N°', defaultValue: '01' }),
            title: fields.text({ label: 'Título' }),
            duration: fields.text({ label: 'Duración', defaultValue: '3:30' }),
            single: fields.checkbox({ label: 'Es sencillo', defaultValue: false })
          }),
          {
            label: 'Tracklist',
            itemLabel: (props) => props.fields.title.value || 'Track sin título'
          }
        )
      }
    }),
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Título (para el slug del archivo)' } }),
        pubDate: fields.date({ label: 'Fecha de publicación (orden)' }),
        es: fields.object(
          {
            date: fields.text({ label: 'Fecha mostrada (ES)' }),
            title: fields.text({ label: 'Título (ES)' }),
            excerpt: fields.text({ label: 'Resumen (ES)', multiline: true })
          },
          { label: 'Español' }
        ),
        en: fields.object(
          {
            date: fields.text({ label: 'Fecha mostrada (EN)' }),
            title: fields.text({ label: 'Título (EN)' }),
            excerpt: fields.text({ label: 'Resumen (EN)', multiline: true })
          },
          { label: 'English' }
        ),
        body: fields.text({ label: 'Contenido', multiline: true })
      }
    })
  }
});
