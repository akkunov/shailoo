// validation.ts
import { z } from "zod";

export const agitatorSchema = z.object({
    firstName: z.string().min(2, "Введите имя"),
    lastName: z.string().min(2, "Введите фамилию"),
    middleName: z.string().optional(),
    phone: z.string().regex(/^\d{10,15}$/, "Телефон должен содержать 10-15 цифр"),
    pin: z.string().optional(),
    uiks: z.array(z.string()).min(1, "Выберите хотя бы один УИК"),
});

export type AgitatorFormValues = z.infer<typeof agitatorSchema>;
