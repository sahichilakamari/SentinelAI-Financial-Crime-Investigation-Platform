import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const investigationsTable = pgTable("investigations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fraudType: text("fraud_type").notNull(),
  severity: text("severity").notNull().default("medium"),
  status: text("status").notNull().default("open"),
  riskScore: numeric("risk_score", { precision: 5, scale: 2 }).notNull().default("0"),
  summary: text("summary").notNull(),
  affectedAccount: text("affected_account").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  analystNote: text("analyst_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertInvestigationSchema = createInsertSchema(investigationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInvestigation = z.infer<typeof insertInvestigationSchema>;
export type Investigation = typeof investigationsTable.$inferSelect;

export const episodesTable = pgTable("episodes", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("locked"),
  aiNarrative: text("ai_narrative").notNull(),
});

export const insertEpisodeSchema = createInsertSchema(episodesTable).omit({ id: true });
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodesTable.$inferSelect;

export const evidenceItemsTable = pgTable("evidence_items", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  evidenceType: text("evidence_type").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  riskLevel: text("risk_level").notNull().default("low"),
  collectedAt: timestamp("collected_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEvidenceItemSchema = createInsertSchema(evidenceItemsTable).omit({ id: true });
export type InsertEvidenceItem = z.infer<typeof insertEvidenceItemSchema>;
export type EvidenceItem = typeof evidenceItemsTable.$inferSelect;

export const transactionEventsTable = pgTable("transaction_events", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  eventTime: text("event_time").notNull(),
  eventType: text("event_type").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }),
  isSuspicious: text("is_suspicious").notNull().default("false"),
  sequenceOrder: integer("sequence_order").notNull(),
});

export const insertTransactionEventSchema = createInsertSchema(transactionEventsTable).omit({ id: true });
export type InsertTransactionEvent = z.infer<typeof insertTransactionEventSchema>;
export type TransactionEvent = typeof transactionEventsTable.$inferSelect;

export const entityNodesTable = pgTable("entity_nodes", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  nodeId: text("node_id").notNull(),
  label: text("label").notNull(),
  entityType: text("entity_type").notNull(),
  riskLevel: text("risk_level").notNull().default("low"),
  metadata: text("metadata"),
});

export const entityEdgesTable = pgTable("entity_edges", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  edgeId: text("edge_id").notNull(),
  sourceNodeId: text("source_node_id").notNull(),
  targetNodeId: text("target_node_id").notNull(),
  relationshipType: text("relationship_type").notNull(),
});

export const aiFindingsTable = pgTable("ai_findings", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  fraudProbability: numeric("fraud_probability", { precision: 5, scale: 2 }).notNull().default("0"),
  modelConfidence: numeric("model_confidence", { precision: 5, scale: 2 }).notNull().default("0"),
  primaryConclusion: text("primary_conclusion").notNull(),
  riskFactorsJson: text("risk_factors_json").notNull().default("[]"),
  predictiveInsight: text("predictive_insight").notNull(),
  recommendedActionsJson: text("recommended_actions_json").notNull().default("[]"),
});

export const activityLogTable = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  investigationId: integer("investigation_id").notNull().references(() => investigationsTable.id, { onDelete: "cascade" }),
  investigationTitle: text("investigation_title").notNull(),
  action: text("action").notNull(),
  severity: text("severity").notNull().default("medium"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});
