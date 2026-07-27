import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  investigationsTable,
  activityLogTable,
} from "@workspace/db";
import { sql, eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  try {
    const [totals] = await db
      .select({ count: sql<number>`count(*)` })
      .from(investigationsTable);

    const [openCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(investigationsTable)
      .where(eq(investigationsTable.status, "open"));

    const [criticalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(investigationsTable)
      .where(eq(investigationsTable.severity, "critical"));

    const [resolvedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(investigationsTable)
      .where(eq(investigationsTable.status, "resolved"));

    const [avgRisk] = await db
      .select({ avg: sql<number>`avg(risk_score::numeric)` })
      .from(investigationsTable);

    res.json({
      totalInvestigations: Number(totals?.count ?? 0),
      openInvestigations: Number(openCount?.count ?? 0),
      criticalAlerts: Number(criticalCount?.count ?? 0),
      resolvedToday: Number(resolvedCount?.count ?? 0),
      avgRiskScore: Number(avgRisk?.avg ?? 0),
      transactionsMonitored: Number(totals?.count ?? 0) * 142,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/recent-activity", async (req, res): Promise<void> => {
  try {
    const activity = await db
      .select()
      .from(activityLogTable)
      .orderBy(desc(activityLogTable.timestamp))
      .limit(20);

    res.json(
      activity.map((a) => ({
        id: a.id,
        investigationId: a.investigationId,
        investigationTitle: a.investigationTitle,
        action: a.action,
        timestamp: a.timestamp.toISOString(),
        severity: a.severity,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get recent activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/risk-breakdown", async (req, res): Promise<void> => {
  try {
    const breakdown = await db
      .select({
        fraudType: investigationsTable.fraudType,
        count: sql<number>`count(*)`,
      })
      .from(investigationsTable)
      .groupBy(investigationsTable.fraudType);

    const total = breakdown.reduce((sum, b) => sum + Number(b.count), 0) || 1;

    res.json(
      breakdown.map((b) => ({
        fraudType: b.fraudType,
        count: Number(b.count),
        percentage: Math.round((Number(b.count) / total) * 100),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get risk breakdown");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
