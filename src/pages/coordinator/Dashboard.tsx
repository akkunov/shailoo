import {Button} from "@/components/ui/button.tsx";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

export default function Dashboard(){
    const navigate = useNavigate()

    const location = useLocation();

    const links = [
        { label: "Агитаторы", path: "agitators" },
        { label: "Избиратели", path: "voters" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
            {/* Навбар */}
            <header className="ticky top-0 z-50 flex md:flex-row flex-col items-center justify-between px-4 md:px-8 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
                <h1 className="text-xl font-semibold tracking-wide text-slate-700">
                    Dashboard
                </h1>

                <nav className="flex overflow-x-auto gap-2 scrollbar-hide">
                    {links.map((link) => {
                        const isActive = location.pathname.includes(link.path);
                        return (
                            <Button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`
                  relative flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300
                  ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-500"
                                        : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                                }
                `}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 rounded-full" />
                                )}
                            </Button>
                        );
                    })}
                </nav>
            </header>

            {/* Контент */}
            <main className="px-4 md:px-8 py-6">
                <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-md">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}