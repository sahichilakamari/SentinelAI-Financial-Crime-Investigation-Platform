import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sql } from "drizzle-orm";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const findings = [
  {
    investigation_id: 2,
    fraud_probability: "0.89",
    model_confidence: "0.91",
    primary_conclusion: "High-confidence account takeover by sophisticated threat actor. Credential stuffing attack followed by immediate high-value transfer to pre-staged mule accounts. Behavioral biometrics diverge sharply from baseline, confirming unauthorized access.",
    risk_factors_json: JSON.stringify([
      { factor: "New device fingerprint", contribution: 0.29, direction: "increase" },
      { factor: "Geographic anomaly (login from overseas)", contribution: 0.23, direction: "increase" },
      { factor: "High-value transfer within 2 min of login", contribution: 0.20, direction: "increase" },
      { factor: "Beneficiary account opened < 14 days", contribution: 0.12, direction: "increase" },
      { factor: "Typing cadence deviation from baseline", contribution: 0.05, direction: "increase" }
    ]),
    predictive_insight: "Pattern matches 94% of confirmed ATO cases in the training corpus. Threat actor likely operates an automated credential-stuffing kit targeting premium wealth clients. Similar TTPs detected across 3 other financial institutions in the past 30 days.",
    recommended_actions_json: JSON.stringify([
      "Immediately freeze the compromised account and all linked accounts",
      "Initiate reverse wire recall with receiving institution",
      "Notify client via out-of-band secure channel (phone verification)",
      "File SAR within 30 days citing account takeover and wire fraud",
      "Enrich threat intelligence feed with device fingerprint and IP range",
      "Enable step-up authentication for all future logins from unrecognized devices"
    ])
  },
  {
    investigation_id: 3,
    fraud_probability: "0.76",
    model_confidence: "0.82",
    primary_conclusion: "Coordinated card testing attack targeting Merchant #4421. Automated bot network executed 847 low-value transactions in 4 hours to validate stolen card numbers before large-scale fraud deployment. Velocity and pattern signature match known carding rings.",
    risk_factors_json: JSON.stringify([
      { factor: "Transaction velocity (847 txns / 4 hrs)", contribution: 0.34, direction: "increase" },
      { factor: "Micro-transaction pattern ($0.99–$2.49 range)", contribution: 0.22, direction: "increase" },
      { factor: "Sequential BIN numbers detected", contribution: 0.11, direction: "increase" },
      { factor: "Single merchant concentration", contribution: 0.06, direction: "increase" },
      { factor: "Off-hours automation signature", contribution: 0.03, direction: "increase" }
    ]),
    predictive_insight: "Card testing typically precedes large-scale fraud within 24–72 hours. The 847 validated cards represent potential exposure of $2.1M–$4.8M if deployed. Recommend immediate block on validated BIN range and merchant notification.",
    recommended_actions_json: JSON.stringify([
      "Block all cards in the tested BIN range (6271-45xx to 6271-49xx)",
      "Notify Merchant #4421 of the testing attack and advise 3DS enforcement",
      "Issue replacement cards to all 847 affected cardholders",
      "File law enforcement referral with full transaction log",
      "Implement CAPTCHA and velocity controls at merchant checkout",
      "Monitor for follow-on large-value transactions on tested cards for 72 hours"
    ])
  },
  {
    investigation_id: 4,
    fraud_probability: "0.81",
    model_confidence: "0.87",
    primary_conclusion: "Synthetic identity fraud confirmed for loan application #LN-2024-8847. Fabricated identity constructed from real PII fragments of three separate individuals. Credit history artificially inflated over 18 months before bust-out event. Loss of $142,000 unsecured lending.",
    risk_factors_json: JSON.stringify([
      { factor: "SSN issued post-2011 but age mismatch", contribution: 0.27, direction: "increase" },
      { factor: "Rapid credit tradeline addition (18 accounts / 6 mo)", contribution: 0.24, direction: "increase" },
      { factor: "Address history inconsistency across bureaus", contribution: 0.16, direction: "increase" },
      { factor: "Phone number linked to 7 other identities", contribution: 0.10, direction: "increase" },
      { factor: "Bust-out pattern: max utilization then default", contribution: 0.04, direction: "increase" }
    ]),
    predictive_insight: "Synthetic identity construction follows a well-documented 'credit piggybacking' pattern. The fabricated identity was likely sold on darkweb forums and used by multiple fraudsters. Cross-referencing SSN fragment with bureau data reveals 4 other synthetic identities using overlapping PII components.",
    recommended_actions_json: JSON.stringify([
      "Charge off loan #LN-2024-8847 and write down $142,000 exposure",
      "File SAR citing synthetic identity fraud and bust-out scheme",
      "Submit PII fragments to consortium fraud database to flag related synthetics",
      "Refer to law enforcement with full identity construction timeline",
      "Update KYC models to flag SSN age-vs-applicant-age discrepancies",
      "Review underwriting criteria for rapid tradeline growth as a denial signal"
    ])
  }
];

for (const f of findings) {
  await db.execute(sql`
    INSERT INTO ai_findings (investigation_id, fraud_probability, model_confidence, primary_conclusion, risk_factors_json, predictive_insight, recommended_actions_json)
    VALUES (${f.investigation_id}, ${f.fraud_probability}, ${f.model_confidence}, ${f.primary_conclusion}, ${f.risk_factors_json}, ${f.predictive_insight}, ${f.recommended_actions_json})
  `);
  console.log(`✓ Seeded AI findings for investigation ${f.investigation_id}`);
}

await pool.end();
process.exit(0);
