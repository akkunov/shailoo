import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiUserPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { voterApi } from "@/api/voters";
import type {VoterInput } from "@/api/voters";
import location from "./location.json";
import toast from "react-hot-toast";
import { useState } from "react";

const formSchema = z.object({
    firstName: z.string().min(2, "Поле не может быть пустым"),
    lastName: z.string().min(2, "Поле не может быть пустым"),
    middleName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    pin: z.string().optional(),
    uikCode: z.string().min(1, "Выберите УИК"),
});

export default function AddVoterForm() {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            middleName: "",
            phone: "",
            address: "",
            pin: "",
            uikCode: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const payload: VoterInput = {
                firstName: values.firstName,
                lastName: values.lastName,
                middleName: values.middleName,
                phone: values.phone,
                address: values.address,
                pin: values.pin,
                uikCode: Number(values.uikCode),
            };
            await voterApi.create(payload);
            toast.success("Избиратель успешно добавлен!");
            form.reset();
        } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Ошибка при добавлении избирателя");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-3 gap-4"
            >
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Имя" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                                <Input placeholder="Фамилия" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Отчество</FormLabel>
                            <FormControl>
                                <Input placeholder="Отчество" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                                <Input placeholder="0551 10 90 90" {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PIN</FormLabel>
                            <FormControl>
                                <Input placeholder="Паспортный PIN" {...field} type="text" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="uikCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>УИК</FormLabel>
                            <FormControl>
                                <select {...field} className="w-full border rounded-md p-2">
                                    <option value="">-- Выберите УИК --</option>
                                    {location.map((school:{code:number,name:string}) => (
                                        <option key={school.code} value={school.code}>
                                            {school.code} — {school.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="col-span-3 mt-4">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Создание..." : "Создать"}
                        <FiUserPlus />
                    </Button>
                </div>
            </form>
        </Form>
    );
}
