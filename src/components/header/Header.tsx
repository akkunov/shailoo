import {Button} from "@/components/ui/button.tsx";
import {RiLogoutCircleRLine} from "react-icons/ri";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/authStore.ts";
import {MdLockReset} from "react-icons/md";
import {GoHome} from "react-icons/go";

export default function Header() {
    const navigate = useNavigate()
    const authStore = useAuthStore();
    function handleLogout () {
        authStore.logout();
        navigate('/admin/login')
    }
    function handleResetPassword () {
        navigate('/reset-password')
    }

    return(
        <header className={`border-b-[1px] border-b-gray-200`}>
            <div className={`max-w-7xl flex flex-row p-3 justify-between`}>
                <Link to={'/'}>
                    <Button  variant={'default'} className={`text-white`}>
                        Главная
                        <GoHome />
                    </Button>
                </Link>
                <div className={`flex flex-row gap-2`}>
                    <div>
                        <h2>{authStore.user?.firstName + " " + authStore.user?.lastName}</h2>
                    </div>
                    <Button  variant={'default'} onClick={handleLogout} className={`text-white`}>
                        <RiLogoutCircleRLine />
                    </Button>

                    <Button  variant={'default'} onClick={handleResetPassword} className={`text-white`}>
                        <MdLockReset  className={`scale-125`}/>
                    </Button>
                </div>

            </div>
        </header>
    )
}