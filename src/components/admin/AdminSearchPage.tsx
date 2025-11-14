

// например, берём роль из стора
import { useAuthStore } from "@/store/authStore";
import {withResetPassword} from "@/components/HOC/withResetPassword.tsx";
import SearchComponent from "@/components/search/Search.tsx";

const SearchWithReset = withResetPassword(SearchComponent, { role: "ADMIN" });

export default function AdminSearchPage() {
    const   user = useAuthStore();

    const Wrapped = user.user?.role === "ADMIN" ? SearchWithReset : SearchComponent;

    return <Wrapped type="agitator" />;
}
