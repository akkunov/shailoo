import {Button} from "@/components/ui/button.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/authStore.ts";


export default function Dashboard() {
    const authStore = useAuthStore()
    const navigate = useNavigate()
    console.log(authStore.token)
    return (
        <>
            <div className={`mt-2 flex flex-row gap-4`}>
                <Button className={`round-sm p-2`} variant={'default'}
                        onClick={() => navigate('coordinators')}
                >
                    Координаторы
                </Button>
                <Button className={`round-sm p-2`} variant={'default'}
                        onClick={() => navigate('agitators')}
                >
                    Агитаторы
                </Button>
                <Button className={`round-sm p-2`} variant={'default'}
                        onClick={() => navigate('voters')}
                >
                    Избиратели
                </Button>
            </div>
            <Outlet />
        </>

    );
}