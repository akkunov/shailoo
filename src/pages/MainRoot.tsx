import Header from "@/components/header/Header.tsx";
import {Outlet} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth.ts";

export default function Root (){
    useAuth()
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}