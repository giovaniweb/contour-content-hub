
import { z } from "zod";
import { MarketingObjectiveType } from "@/types/script";

export const customGptFormSchema = z.object({
  topic: z.string().min(2, {
    message: "O tópico deve ter pelo menos 2 caracteres.",
  }).optional(),
  tone: z.string().optional(),
  quantity: z.string().optional(),
  additionalInfo: z.string().optional(),
  resetAfterSubmit: z.boolean().default(false),
  marketingObjective: z.string().optional(),
  bodyArea: z.string().optional(),
  purposes: z.array(z.string()).optional(),
});

export type CustomGptFormValues = z.infer<typeof customGptFormSchema>;

export const defaultFormValues: CustomGptFormValues = {
  topic: "",
  tone: "",
  quantity: "1",
  additionalInfo: "",
  resetAfterSubmit: false,
  marketingObjective: "🟡 Atrair Atenção",
  bodyArea: "",
  purposes: [],
};
