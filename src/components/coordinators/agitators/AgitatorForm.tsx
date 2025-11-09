import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card } from "@/components/ui/card.tsx";
import { MultiSelect } from "@/components/ui/multi-select.tsx";
import toast from "react-hot-toast";

import type { UIK, User } from "@/types/models.ts";
import type { AgitatorFormValues } from "@/lib/validation.ts";
import { agitatorSchema } from "@/lib/validation.ts";
import type {CreateAgitatorInput, Result} from "@/store/agitatorsStore.tsx";

interface Props {
    user: User | null;
    uiks: UIK[];
    createAgitator: (input: Partial<CreateAgitatorInput>) => Promise<Result<User>>;
    fetchAgitators: (type: string) => Promise<void>;
}

export default function AgitatorForm({ user, uiks, createAgitator, fetchAgitators }: Props) {
    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<AgitatorFormValues>({
        resolver: zodResolver(agitatorSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            middleName: "",
            phone: "",
            pin: "",
            uiks: [],
        },
    });

    const selectedUiks = watch("uiks");

    const onSubmit = async (data: AgitatorFormValues) => {
        if (!user) return toast.error("Пользователь не найден");

        try {
            const payload = { ...data, uiks: data.uiks.map(Number), coordinatorId: user.id };
           const result= await createAgitator(payload);
           console.log(result)
            if (!result.success) {
                toast.error(result.message);
                reset();
                return;
            }
            toast.success("Агитатор добавлен");
            reset();
            await fetchAgitators("agitators");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Ошибка при добавлении");
        }
    };

    return (
        <Card className="p-4 space-y-3">
            <h2 className="text-lg font-semibold">Добавить агитатора</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
                <div>
                    <Label>Фамилия</Label>
                    <Input {...register("lastName")} />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
                <div>
                    <Label>Имя</Label>
                    <Input {...register("firstName")} />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>
                <div>
                    <Label>Отчество</Label>
                    <Input {...register("middleName")} />
                </div>
                <div>
                    <Label>Телефон</Label>
                    <Input {...register("phone")} />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div>
                    <Label>PIN</Label>
                    <Input {...register("pin")} />
                    {errors.pin && <p className="text-red-500 text-sm">{errors.pin.message}</p>}
                </div>
                <div>
                    <Label>Прикрепить к УИК</Label>
                    <MultiSelect
                        options={uiks.map(uik => ({ label: `${uik.code} — ${uik.name}`, value: String(uik.code) }))}
                        selected={selectedUiks}
                        onChange={(values) => setValue("uiks", values)}
                        placeholder="Выберите УИКи"
                    />
                    {errors.uiks && <p className="text-red-500 text-sm">{errors.uiks.message}</p>}
                </div>
                <div className="md:col-span-3 mt-2">
                    <Button type="submit">Добавить</Button>
                </div>
            </form>
        </Card>
    );
}
