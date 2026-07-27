import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  investigationsTable,
  episodesTable,
  evidenceItemsTable,
  transactionEventsTable,
  entityNodesTable,
  entityEdgesTable,
  aiFindingsTable,
  activityLogTable,
} from "@workspace/db";
import {
  CreateInvestigationBody,
  UpdateInvestigationBody,
  GetInvestigationParams,
  UpdateInvestigationParams,
  DeleteInvestigationParams,
  ListEpisodesParams,
  ListEvidenceParams,
  ListTransactionsParams,
  GetEntityGraphParams,
  GetAiFindingsParams,
  GetInvestigationReportParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseId(raw: string | string[]): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  return parseInt(s, 10);
}

function mapInvestigation(inv: typeof investigationsTable.$inferSelect) {
  return {
    id: inv.id,
    title: inv.title,
    fraudType: inv.fraudType,
    severity: inv.severity,
    status: inv.status,
    riskScore: Number(inv.riskScore),
    summary: inv.summary,
    affectedAccount: inv.affectedAccount,
    amount: Number(inv.amount),
    currency: inv.currency,
    analystNote: inv.analystNote ?? null,
    createdAt: inv.createdAt.toISOString(),
    updatedAt: inv.updatedAt.toISOString(),
  };
}

// LIST
router.get("/investigations", async (req, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(investigationsTable)
      .orderBy(investigationsTable.createdAt);
    res.json(rows.map(mapInvestigation));
  } catch (err) {
    req.log.error({ err }, "Failed to list investigations");
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE
router.post("/investigations", async (req, res): Promise<void> => {
  const parsed = CreateInvestigationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [inv] = await db
      .insert(investigationsTable)
      .values({
        title: parsed.data.title,
        fraudType: parsed.data.fraudType,
        severity: parsed.data.severity,
        summary: parsed.data.summary,
        affectedAccount: parsed.data.affectedAccount,
        amount: String(parsed.data.amount),
        currency: parsed.data.currency,
        analystNote: parsed.data.analystNote ?? null,
      })
      .returning();

    // Log activity
    await db.insert(activityLogTable).values({
      investigationId: inv.id,
      investigationTitle: inv.title,
      action: "Investigation created",
      severity: inv.severity,
    });

    res.status(201).json(mapInvestigation(inv));
  } catch (err) {
    req.log.error({ err }, "Failed to create investigation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET by ID
router.get("/investigations/:id", async (req, res): Promise<void> => {
  const params = GetInvestigationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [inv] = await db
      .select()
      .from(investigationsTable)
      .where(eq(investigationsTable.id, params.data.id));
    if (!inv) {
      res.status(404).json({ error: "Investigation not found" });
      return;
    }
    res.json(mapInvestigation(inv));
  } catch (err) {
    req.log.error({ err }, "Failed to get investigation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE
router.patch("/investigations/:id", async (req, res): Promise<void> => {
  const params = UpdateInvestigationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateInvestigationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const updateData: Record<string, unknown> = {};
    if (body.data.title !== undefined) updateData.title = body.data.title;
    if (body.data.status !== undefined) updateData.status = body.data.status;
    if (body.data.severity !== undefined) updateData.severity = body.data.severity;
    if (body.data.analystNote !== undefined) updateData.analystNote = body.data.analystNote;

    const [inv] = await db
      .update(investigationsTable)
      .set(updateData)
      .where(eq(investigationsTable.id, params.data.id))
      .returning();
    if (!inv) {
      res.status(404).json({ error: "Investigation not found" });
      return;
    }

    await db.insert(activityLogTable).values({
      investigationId: inv.id,
      investigationTitle: inv.title,
      action: `Status updated to ${inv.status}`,
      severity: inv.severity,
    });

    res.json(mapInvestigation(inv));
  } catch (err) {
    req.log.error({ err }, "Failed to update investigation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
router.delete("/investigations/:id", async (req, res): Promise<void> => {
  const params = DeleteInvestigationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    await db
      .delete(investigationsTable)
      .where(eq(investigationsTable.id, params.data.id));
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete investigation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// LIST EPISODES
router.get("/investigations/:id/episodes", async (req, res): Promise<void> => {
  const params = ListEpisodesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const episodes = await db
      .select()
      .from(episodesTable)
      .where(eq(episodesTable.investigationId, params.data.id))
      .orderBy(episodesTable.episodeNumber);
    res.json(
      episodes.map((e) => ({
        id: e.id,
        investigationId: e.investigationId,
        episodeNumber: e.episodeNumber,
        title: e.title,
        description: e.description,
        status: e.status,
        aiNarrative: e.aiNarrative,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list episodes");
    res.status(500).json({ error: "Internal server error" });
  }
});

// LIST EVIDENCE
router.get("/investigations/:id/evidence", async (req, res): Promise<void> => {
  const params = ListEvidenceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const items = await db
      .select()
      .from(evidenceItemsTable)
      .where(eq(evidenceItemsTable.investigationId, params.data.id));
    res.json(
      items.map((e) => ({
        id: e.id,
        investigationId: e.investigationId,
        evidenceType: e.evidenceType,
        label: e.label,
        value: e.value,
        riskLevel: e.riskLevel,
        collectedAt: e.collectedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list evidence");
    res.status(500).json({ error: "Internal server error" });
  }
});

// LIST TRANSACTIONS
router.get("/investigations/:id/transactions", async (req, res): Promise<void> => {
  const params = ListTransactionsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const events = await db
      .select()
      .from(transactionEventsTable)
      .where(eq(transactionEventsTable.investigationId, params.data.id))
      .orderBy(transactionEventsTable.sequenceOrder);
    res.json(
      events.map((e) => ({
        id: e.id,
        investigationId: e.investigationId,
        timestamp: e.timestamp.toISOString(),
        eventTime: e.eventTime,
        eventType: e.eventType,
        description: e.description,
        amount: e.amount !== null ? Number(e.amount) : null,
        isSuspicious: e.isSuspicious === "true",
        sequenceOrder: e.sequenceOrder,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET ENTITY GRAPH
router.get("/investigations/:id/graph", async (req, res): Promise<void> => {
  const params = GetEntityGraphParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const nodes = await db
      .select()
      .from(entityNodesTable)
      .where(eq(entityNodesTable.investigationId, params.data.id));
    const edges = await db
      .select()
      .from(entityEdgesTable)
      .where(eq(entityEdgesTable.investigationId, params.data.id));
    res.json({
      nodes: nodes.map((n) => ({
        id: n.nodeId,
        label: n.label,
        entityType: n.entityType,
        riskLevel: n.riskLevel,
        metadata: n.metadata ?? undefined,
      })),
      edges: edges.map((e) => ({
        id: e.edgeId,
        source: e.sourceNodeId,
        target: e.targetNodeId,
        relationshipType: e.relationshipType,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get entity graph");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET AI FINDINGS
router.get("/investigations/:id/ai-findings", async (req, res): Promise<void> => {
  const params = GetAiFindingsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [findings] = await db
      .select()
      .from(aiFindingsTable)
      .where(eq(aiFindingsTable.investigationId, params.data.id));
    if (!findings) {
      res.status(404).json({ error: "AI findings not found" });
      return;
    }
    res.json({
      investigationId: findings.investigationId,
      fraudProbability: Number(findings.fraudProbability),
      modelConfidence: Number(findings.modelConfidence),
      primaryConclusion: findings.primaryConclusion,
      riskFactors: JSON.parse(findings.riskFactorsJson),
      predictiveInsight: findings.predictiveInsight,
      recommendedActions: JSON.parse(findings.recommendedActionsJson),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get AI findings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET INVESTIGATION REPORT
router.get("/investigations/:id/report", async (req, res): Promise<void> => {
  const params = GetInvestigationReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [inv] = await db
      .select()
      .from(investigationsTable)
      .where(eq(investigationsTable.id, params.data.id));
    if (!inv) {
      res.status(404).json({ error: "Investigation not found" });
      return;
    }
    res.json({
      investigationId: inv.id,
      title: inv.title,
      executiveSummary: inv.summary,
      generatedAt: new Date().toISOString(),
      fraudType: inv.fraudType,
      severity: inv.severity,
      riskScore: Number(inv.riskScore),
      affectedAccount: inv.affectedAccount,
      amount: Number(inv.amount),
      currency: inv.currency,
      complianceNotes: `This report was auto-generated by SentinelAI. All findings are based on automated analysis and should be reviewed by a qualified compliance officer before filing a Suspicious Activity Report (SAR). Investigation ID: ${inv.id}. Case opened: ${inv.createdAt.toISOString()}.`,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get investigation report");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
