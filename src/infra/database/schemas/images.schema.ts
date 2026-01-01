import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { uuidv7 } from 'uuidv7'
import { cryptids } from './cryptids.schema'

export const images = pgTable('images', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  cryptidId: integer('cryptid_id').notNull().references(() => cryptids.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  imageSize: text('image_size').notNull().default('2:3'),
  altText: text('alt_text').notNull(),
  source: text('source').notNull(),
  license: text('license').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const selectImageSchema = createSelectSchema(images)
