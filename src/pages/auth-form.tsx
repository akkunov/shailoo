import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoChevronRight } from "react-icons/go";

import type {User} from "@/types/models.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {api} from "@/api/axios.ts";
import toast, {Toaster} from "react-hot-toast";
import type {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";


// Схема валидации через Zod
const authSchema = z.object({
    phone: z.string().min(6, "Телефон должен быть минимум 6 символов"),
    password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthForm() {
    const navigate = useNavigate();
    const authStore = useAuthStore();

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            phone: "",
            password: "",
        },
    });

    const onSubmit = async (values: AuthFormValues) => {
        try {
            const response = await api.post<{
                user: User;
                token: string;
            }>("/auth/login", values);

            authStore.setUser(response.data.user, response.data.token);

            navigate('/')

        } catch (err:unknown) {
            const axiosError = err as AxiosError<{ message: string }>;
            const message = axiosError?.response?.data?.message || "Произошла ошибка";
            toast(message)
        }
    };

    return (
        <div className={`flex flex-col justify-center items-center h-screen`}>
            <Form {...form}>
                <Toaster />
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-72">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                    <Input placeholder="Введите телефон" {...field} type={'tel'}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Введите пароль" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" variant="default">
                        Войти <GoChevronRight className="ml-4" />
                    </Button>
                </form>
            </Form>
        </div>

    );
}
