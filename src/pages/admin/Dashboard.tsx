import {Button} from "@/components/ui/button.tsx";
import {Outlet, useNavigate} from "react-router-dom";


export default function Dashboard() {
    const navigate = useNavigate()
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