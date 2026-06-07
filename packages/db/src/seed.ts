import { db } from "./index";
import * as schema from "./schema";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Tenant
  console.log("Inserting Tenant...");
  const [tenant] = await db.insert(schema.tenants).values({
    name: "Chat-NCERT Academy",
    apiKey: "sample-api-key-123",
    planTier: "free",
    ollamaTunnelUrl: "http://localhost:11434",
  }).returning();

  if (!tenant) throw new Error("Failed to insert tenant");

  // 2. Seed Users
  console.log("Inserting Users...");
  const [student] = await db.insert(schema.users).values({
    tenantId: tenant.id,
    email: "student@chatncert.academy",
    name: "Sahil Khan",
    role: "student",
  }).returning();

  const [instructor] = await db.insert(schema.users).values({
    tenantId: tenant.id,
    email: "instructor@chatncert.academy",
    name: "Instructor Vidya",
    role: "instructor",
  }).returning();

  const [admin] = await db.insert(schema.users).values({
    tenantId: tenant.id,
    email: "admin@chatncert.academy",
    name: "Admin Dev",
    role: "tenant_admin",
  }).returning();

  if (!student || !instructor || !admin) throw new Error("Failed to insert users");

  // 3. Seed Document
  console.log("Inserting Document...");
  const [document] = await db.insert(schema.documents).values({
    tenantId: tenant.id,
    title: "Class 10 Science: Chemical Reactions and Equations",
    r2Path: "class10_science_chapter1.pdf",
    class: "10",
    subject: "Science",
  }).returning();

  if (!document) throw new Error("Failed to insert document");

  // 4. Seed Embeddings
  console.log("Inserting Embeddings...");
  const dummyEmbedding = Array.from({ length: 768 }, (_, i) => Math.sin(i));
  await db.insert(schema.embeddings).values([
    {
      tenantId: tenant.id,
      documentId: document.id,
      content: "Chemical equations are representations of chemical reactions using symbols and formulae of the substances involved. A balanced chemical equation has equal numbers of atoms of each element on both sides.",
      embedding: dummyEmbedding,
      metadata: { page: 1, section: "Introduction" },
    },
    {
      tenantId: tenant.id,
      documentId: document.id,
      content: "Combination reaction is a reaction in which two or more reactants combine to form a single product. Example: Burning of coal, formation of water.",
      embedding: dummyEmbedding,
      metadata: { page: 3, section: "Types of Chemical Reactions" },
    },
  ]);

  // 5. Seed Quizzes
  console.log("Inserting Quiz...");
  const [quiz] = await db.insert(schema.quizzes).values({
    tenantId: tenant.id,
    documentId: document.id,
    title: "Chemical Reactions Quiz - Chapter 1",
    questions: [
      {
        id: "q1",
        text: "What is a balanced chemical equation?",
        options: [
          "An equation with unequal number of atoms on both sides",
          "An equation with equal number of atoms on both sides",
          "An equation without chemical formulas",
          "An equation with only one reactant"
        ],
        answerKeyIndex: 1,
      },
      {
        id: "q2",
        text: "Which of the following is a decomposition reaction?",
        options: [
          "Burning of coal",
          "Heating of lead nitrate",
          "Rusting of iron",
          "Respiration"
        ],
        answerKeyIndex: 1,
      }
    ],
  }).returning();

  if (!quiz) throw new Error("Failed to insert quiz");

  // 6. Seed Quiz Attempt
  console.log("Inserting Quiz Attempt...");
  await db.insert(schema.quizAttempts).values({
    tenantId: tenant.id,
    userId: student.id,
    quizId: quiz.id,
    score: 2,
    timeTaken: 45,
    answers: { q1: 1, q2: 1 },
  });

  // 7. Seed Community Posts
  console.log("Inserting Community Posts...");
  await db.insert(schema.posts).values([
    {
      tenantId: tenant.id,
      authorId: student.id,
      title: "How do I balance the Fe + H2O -> Fe3O4 + H2 equation?",
      content: "I'm having trouble with the coefficient for water and hydrogen. Can someone explain the step-by-step coefficients?",
      comments: [
        {
          id: "c1",
          authorId: instructor.id,
          content: "Hi Sahil, start by balancing Fe first. You have 3 Fe on the right, so put 3 in front of Fe. Next, you have 4 O on the right, so put 4 in front of H2O. Finally, balance H by putting 4 in front of H2.",
          createdAt: new Date().toISOString(),
          replies: []
        }
      ],
      reactions: {
        thumbsup: [student.id, instructor.id],
      },
    }
  ]);

  // 8. Seed Assignments
  console.log("Inserting Assignment...");
  const [assignment] = await db.insert(schema.assignments).values({
    tenantId: tenant.id,
    title: "Assignment 1: Write and Balance Equations",
    description: "Please write balanced chemical equations for the following: 1. Hydrogen + Chlorine -> Hydrogen Chloride. 2. Barium Chloride + Aluminium Sulphate -> Barium Sulphate + Aluminium Chloride.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    rubric: [
      { criterion: "Accuracy of chemical formulas", maxPoints: 5 },
      { criterion: "Correctly balanced coefficients", maxPoints: 5 }
    ],
  }).returning();

  if (!assignment) throw new Error("Failed to insert assignment");

  // 9. Seed Submission
  console.log("Inserting Submission...");
  await db.insert(schema.submissions).values({
    tenantId: tenant.id,
    userId: student.id,
    assignmentId: assignment.id,
    content: "1. H2 + Cl2 -> 2HCl\n2. 3BaCl2 + Al2(SO4)3 -> 3BaSO4 + 2AlCl3",
    status: "submitted",
  });

  console.log("🎉 Database seeded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
