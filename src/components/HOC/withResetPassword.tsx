// withResetPassword.tsx
import React, { useState } from "react";
import { api } from "@/api/axios";
import toast from "react-hot-toast";

interface WithResetPasswordOptions {
    role: "ADMIN" | "USER";
}

export function withResetPassword<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: WithResetPasswordOptions
) {
    return (props: P) => {
        const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

        const handleReset = async () => {
            if (!selectedPhone) return;

            try {
                 await api.post(`/users/reset`, { phone: selectedPhone });
                toast.success(`Пароль сброшен. Новый пароль: Pass200042-`);
            } catch (err:unknown) {
                toast.error(err instanceof Error ? err.message : "Ошибка загрузки данных");
            }
        };

        // Если не админ — просто рендерим как есть
        if (options.role !== "ADMIN") return <WrappedComponent {...props} />;

        return (
            <div className="relative">
                <WrappedComponent
                    {...props}
                    // 👇 мы расширяем дочерний компонент колбэком для выбора юзера
                    onUserSelect={(phone: string) => setSelectedPhone(phone)}
                />
                {selectedPhone && (
                    <button
                        onClick={handleReset}
                        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition"
                    >
                        Сбросить пароль
                    </button>
                )}
            </div>
        );
    };
}
