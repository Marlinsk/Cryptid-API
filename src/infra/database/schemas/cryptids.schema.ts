import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { classifications } from './classifications.schema'
import { habitats } from './habitats.schema'
import { realms } from './realms.schema'

export const cryptids = pgTable('cryptids', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  aliases: jsonb('aliases').$type<string[]>().notNull().default([]),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  originSummary: text('origin_summary').notNull(),
  physicalDescription: text('physical_description'),
  behaviorNotes: text('behavior_notes'),
  manifestationConditions: text('manifestation_conditions'),
  timelineSummary: text('timeline_summary'),
  containmentNotes: text('containment_notes'),
  classificationId: integer('classification_id').notNull().references(() => classifications.id),
  realmId: integer('realm_id').notNull().references(() => realms.id),
  habitatId: integer('habitat_id').notNull().references(() => habitats.id),
  status: varchar('status', { length: 100 }).notNull(),
  threatLevel: varchar('threat_level', { length: 100 }).notNull(),
  firstReportedAt: timestamp('first_reported_at'),
  lastReportedAt: timestamp('last_reported_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const selectCryptidSchema = createSelectSchema(cryptids)
