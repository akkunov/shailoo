import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {GoChevronRight} from "react-icons/go";
import {useEffect} from "react";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Логин должен быть минимум 2 символа",
    }),
    password: z.string().min(6, {
        message: "Пароль должен быть минимум 6 символов",
    }),
})

export default function AuthForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })
    useEffect(() => {
        console.log("rendered")
    },[])
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Форма отправлена:", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-72">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите логин" {...field} />
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

                <Button type="submit" className="w-full" variant={'ghost'}>
                    Войти
                    <GoChevronRight className={`ml-4`}/>
                </Button>
            </form>
        </Form>
    )
}
