import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FiUserPlus} from "react-icons/fi";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";


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
    okrug: z.string().min(6, {
        message: "Поле не может быть пустым",
    }),
})



export default function AddCorespondent() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            name: '',
            lastName: '',
            phone: '',
            pin:'',
            okrug:'',
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
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                                <Input placeholder="Фамилия" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Имя" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Отчество </FormLabel>
                            <FormControl>
                                <Input placeholder="Отчество" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Номер телефона </FormLabel>
                            <FormControl>
                                <Input placeholder="0551 10 90 90" {...field} type={'number'}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pin"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Паспортные данные</FormLabel>
                            <FormControl>
                                <Input placeholder="pin" {...field} type={'number'} required/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pin"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Паспортные данные</FormLabel>
                            <FormControl>
                                <Input placeholder="pin" {...field} type={'number'} required/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full mt-6" variant={'ghost'}>
                    Создать
                    <FiUserPlus/>
                </Button>
            </form>
        </Form>
    )
}