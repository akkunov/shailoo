import {Button} from "@/components/ui/button.tsx";
import {RiLogoutCircleRLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/authStore.ts";

export default function Header() {
    const navigate = useNavigate()
    const authStore = useAuthStore();
    function handleLogout () {
        authStore.logout();
        navigate('/admin/login')
    }

    return(
        <header className={`border-b-[1px] border-b-gray-200`}>
            <div className={`max-w-7xl flex flex-row p-3 justify-between`}>
                <Button  variant={'secondary'} onClick={handleLogout} className={`text-white`}>
                    Выйти
                    <RiLogoutCircleRLine />
                </Button>
            </div>
        </header>
    )
}