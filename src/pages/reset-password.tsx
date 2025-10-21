import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore.ts";
import toast, { Toaster } from "react-hot-toast";

const schema = z
    .object({
        oldPassword: z.string().min(6, "Минимум 6 символов"),
        newPassword: z.string().min(6, "Минимум 6 символов"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const { loading, resetPassword, error } = useAuthStore();

    // 👇 состояния для показа/скрытия пароля
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit = async (data: FormData) => {
        await resetPassword(data.oldPassword, data.newPassword);
        if (error) toast.error(error);
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <Toaster />
            <div className="w-full max-w-md border rounded-xl shadow-sm p-6 bg-white">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Смена пароля
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Старый пароль */}
                    <div>
                        <label className="text-sm font-medium">Старый пароль</label>
                        <div className="relative">
                            <Input
                                type={showOld ? "text" : "password"}
                                placeholder="Введите старый пароль"
                                {...register("oldPassword")}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowOld((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                variant={'ghost'}
                            >
                                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {errors.oldPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Новый пароль */}
                    <div>
                        <label className="text-sm font-medium">Новый пароль</label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                placeholder="Введите новый пароль"
                                {...register("newPassword")}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowNew((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent"
                                variant={'ghost'}

                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Подтверждение пароля */}
                    <div>
                        <label className="text-sm font-medium">Подтверждение пароля</label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Повторите новый пароль"
                                {...register("confirmPassword")}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent outline-none border-none"
                                variant={'ghost'}

                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                        Сменить пароль
                    </Button>
                </form>
            </div>
        </div>
    );
}
