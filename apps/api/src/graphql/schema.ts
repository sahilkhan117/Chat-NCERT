import { createSchema, type YogaInitialContext } from "graphql-yoga";
import { db } from "@chat-ncert/db";
import { eq, desc } from "drizzle-orm";
import { posts, quizzes, quizAttempts } from "@chat-ncert/db";
import type { AuthContext } from "../middleware/auth";

interface GraphQLContext extends YogaInitialContext {
  auth?: AuthContext;
}

export const schema = createSchema({
  typeDefs: `
    scalar JSON

    type Comment {
      id: ID!
      authorId: ID!
      content: String!
      createdAt: String!
    }

    type Post {
      id: ID!
      tenantId: ID!
      authorId: ID!
      title: String!
      content: String!
      comments: [Comment!]!
      reactions: JSON!
      createdAt: String!
    }

    type Quiz {
      id: ID!
      tenantId: ID!
      title: String!
      questions: JSON!
      createdAt: String!
    }

    type QuizAttempt {
      id: ID!
      tenantId: ID!
      userId: ID!
      quizId: ID!
      score: Int!
      timeTaken: Int!
      createdAt: String!
    }

    type StudentDashboard {
      completedQuizzesCount: Int!
      averageQuizScore: Float!
      recentAttempts: [QuizAttempt!]!
    }

    type Query {
      posts(limit: Int, offset: Int): [Post!]!
      quizzes: [Quiz!]!
      studentDashboard: StudentDashboard!
    }

    type Mutation {
      createPost(title: String!, content: String!): Post!
      createComment(postId: ID!, content: String!): Comment!
      submitQuizAttempt(quizId: ID!, answers: JSON!, score: Int!, timeTaken: Int!): QuizAttempt!
    }
  `,
  resolvers: {
    Query: {
      posts: async (_, { limit = 20, offset = 0 }, context: GraphQLContext) => {
        const tenantId = context.auth?.tenantId;
        if (!tenantId) throw new Error("Unauthorized");

        // Fetch posts from database filtered by tenant_id
        try {
          return await db
            .select()
            .from(posts)
            .where(eq(posts.tenantId, tenantId))
            .limit(limit)
            .offset(offset)
            .orderBy(desc(posts.createdAt));
        } catch {
          // Mock fallback if DB is not populated/connected yet
          return [
            {
              id: "mock-post-1",
              tenantId,
              authorId: "mock-author-1",
              title: "Welcome to Chat-NCERT!",
              content: "Use this community board to ask questions about your classes.",
              comments: [],
              reactions: {},
              createdAt: new Date().toISOString(),
            },
          ];
        }
      },
      quizzes: async (_, __, context: GraphQLContext) => {
        const tenantId = context.auth?.tenantId;
        if (!tenantId) throw new Error("Unauthorized");

        try {
          return await db.select().from(quizzes).where(eq(quizzes.tenantId, tenantId));
        } catch {
          return [
            {
              id: "mock-quiz-1",
              tenantId,
              title: "NCERT Class 10 Chemistry Quiz",
              questions: [
                {
                  id: "q1",
                  text: "What is the chemical formula of rust?",
                  options: ["Fe2O3", "FeO", "Fe3O4", "Fe(OH)3"],
                  answerKeyIndex: 0,
                },
              ],
              createdAt: new Date().toISOString(),
            },
          ];
        }
      },
      studentDashboard: async (_, __, context: GraphQLContext) => {
        const auth = context.auth;
        if (!auth?.userId) throw new Error("Unauthorized");

        try {
          const attempts = await db
            .select()
            .from(quizAttempts)
            .where(eq(quizAttempts.userId, auth.userId))
            .orderBy(desc(quizAttempts.createdAt));

          const totalScore = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
          const avgScore = attempts.length > 0 ? totalScore / attempts.length : 0;

          return {
            completedQuizzesCount: attempts.length,
            averageQuizScore: avgScore,
            recentAttempts: attempts.slice(0, 5),
          };
        } catch {
          return {
            completedQuizzesCount: 0,
            averageQuizScore: 0.0,
            recentAttempts: [],
          };
        }
      },
    },
    Mutation: {
      createPost: async (_, { title, content }, context: GraphQLContext) => {
        const auth = context.auth;
        if (!auth?.tenantId || !auth?.userId) throw new Error("Unauthorized");

        try {
          const [newPost] = await db
            .insert(posts)
            .values({
              tenantId: auth.tenantId,
              authorId: auth.userId,
              title,
              content,
              comments: [],
              reactions: {},
            })
            .returning();
          return newPost;
        } catch {
          return {
            id: `post-${Date.now()}`,
            tenantId: auth.tenantId,
            authorId: auth.userId,
            title,
            content,
            comments: [],
            reactions: {},
            createdAt: new Date().toISOString(),
          };
        }
      },
      createComment: async (_, { postId, content }, context: GraphQLContext) => {
        const auth = context.auth;
        if (!auth?.userId) throw new Error("Unauthorized");

        const newComment = {
          id: `comment-${Date.now()}`,
          authorId: auth.userId,
          content,
          createdAt: new Date().toISOString(),
        };

        try {
          const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
          if (!post) throw new Error("Post not found");

          const updatedComments = [...(post.comments as any[]), newComment];

          await db.update(posts).set({ comments: updatedComments }).where(eq(posts.id, postId));

          return newComment;
        } catch {
          return newComment;
        }
      },
      submitQuizAttempt: async (
        _,
        { quizId, answers, score, timeTaken },
        context: GraphQLContext,
      ) => {
        const auth = context.auth;
        if (!auth?.userId || !auth?.tenantId) throw new Error("Unauthorized");

        try {
          const [attempt] = await db
            .insert(quizAttempts)
            .values({
              tenantId: auth.tenantId,
              userId: auth.userId,
              quizId,
              score,
              timeTaken,
              answers,
            })
            .returning();
          return attempt;
        } catch {
          return {
            id: `attempt-${Date.now()}`,
            tenantId: auth.tenantId,
            userId: auth.userId,
            quizId,
            score,
            timeTaken,
            createdAt: new Date().toISOString(),
          };
        }
      },
    },
  },
});
