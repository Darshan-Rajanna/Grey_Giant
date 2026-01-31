import { z } from "zod";

// --- Schemas (formerly in shared/schema.ts) ---

export const inquirySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required").regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    eventType: z.string().optional(),
    message: z.string().min(1, "Message is required"),
    createdAt: z.string().optional(),
});

export const reviewSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1, "Comment is required"),
    createdAt: z.string().optional(),
});

export const insertInquirySchema = inquirySchema.omit({ id: true, createdAt: true });
export const insertReviewSchema = reviewSchema.omit({ id: true, createdAt: true });

export type Inquiry = z.infer<typeof inquirySchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// --- API Routes (formerly in shared/routes.ts) ---

export const errorSchemas = {
    validation: z.object({
        message: z.string(),
        field: z.string().optional(),
    }),
    internal: z.object({
        message: z.string(),
    }),
};

export const api = {
    inquiries: {
        create: {
            method: "POST" as const,
            path: "/api/inquiries",
            input: insertInquirySchema,
            responses: {
                201: inquirySchema,
                400: errorSchemas.validation,
            },
        },
    },
    reviews: {
        list: {
            method: "GET" as const,
            path: "/api/reviews",
            responses: {
                200: z.array(reviewSchema),
            },
        },
        create: {
            method: "POST" as const,
            path: "/api/reviews",
            input: insertReviewSchema,
            responses: {
                201: reviewSchema,
                400: errorSchemas.validation,
            },
        },
    },
};
