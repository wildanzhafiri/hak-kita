import { z } from 'zod';
import { TanggalSchema } from './program.schema';

const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const KnowledgeDocumentSchema = z
  .object({
    id: SlugSchema,
    programId: SlugSchema,
    sourceUrl: z.url().refine((value) => {
      const url = new URL(value);
      return (
        url.protocol === 'https:' && (url.hostname === 'go.id' || url.hostname.endsWith('.go.id'))
      );
    }),
    checkedOn: TanggalSchema,
    passages: z
      .array(
        z.object({
          id: SlugSchema,
          title: z.string().min(5),
          text: z.string().min(15),
        }),
      )
      .min(1),
  })
  .superRefine((document, context) => {
    const ids = document.passages.map((passage) => passage.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({ code: 'custom', path: ['passages'], message: 'ID bagian harus unik' });
    }
  });
