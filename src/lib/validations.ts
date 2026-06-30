import { z } from "zod"

const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Min 1"),
  rate: z.coerce.number().min(0, "Rate must be positive"),
  amount: z.coerce.number(),
})

export const quotationSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().optional(),
  companyName: z.string().optional(),
  validUntil: z.string().min(1, "Valid until date is required"),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item"),
  taxPercent: z.coerce.number().min(0).max(100),
  notes: z.string().optional(),
})
