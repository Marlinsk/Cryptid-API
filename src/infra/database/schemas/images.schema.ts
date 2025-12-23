import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { cryptids } from './cryptids.schema'

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  cryptidId: integer('cryptid_id').notNull().references(() => cryptids.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text').notNull(),
  source: text('source').notNull(),
  license: varchar('license', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const selectImageSchema = createSelectSchema(images)
