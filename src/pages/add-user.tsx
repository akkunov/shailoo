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
import {FiUserPlus} from "react-icons/fi";

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "Поле не может быть пустым",
    }),
    name: z.string().min(2, {
        message: "Поле не может быть пустым",
    }),
    lastName: z.string().min(2, {
        message: "Поле не может быть пустым",
    }),
    phone: z.string().min(6, {
        message: "Поле не может быть пустым",
    }),
    pin: z.string().min(6, {
        message: "Поле не может быть пустым",
    }),
})

export default function AddUser() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            name: '',
            lastName: '',
            phone: '',
            pin:''
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Форма отправлена:", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4 ">
                <FormField
                    control={form.control}
                    name="firstName"
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
                    name="name"
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
                            <FormLabel>Отчество </FormLabel>
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
                            <FormLabel>Номер телефона </FormLabel>
                            <FormControl>
                                <Input placeholder="0551 10 90 90" {...field} type={'number'} />
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
                            <FormLabel>Паспортные данные</FormLabel>
                            <FormControl>
                                <Input placeholder="pin" {...field} type={'number'}  required/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full mt-6" variant={'ghost'}>
                    Создать
                    <FiUserPlus />
                </Button>
            </form>
        </Form>
    )
}
