import { optional, z } from "zod"

export const Bookmark = z.object({
  url: z.string(),
  host: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tag: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
})

export const UpdateBookmark = Bookmark.extend({
  id: z.string(),
  tag: z
    .object({
      connect: z
        .object({
          id: z.string(),
        })
        .optional(),
      disconnect: z.boolean().optional(),
    })
    .optional(),
})
