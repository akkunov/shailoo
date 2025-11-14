import React, { useEffect, useState, useRef } from "react";
import type { Agitator, Voter } from "./types";
import {api} from "@/api/axios.ts";
import toast from "react-hot-toast";

interface SearchProps {
    type?: "agitator" | "voter";
    onUserSelect?: (phone: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({ type,onUserSelect  }) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<Agitator[] | Voter[]>([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const take = 10;

    const firstRender = useRef(true); // чтобы пропустить первый рендер

    const fetchResults = async (reset = false) => {
        if (loading) return;
        if (!search) {
            setResults([]);
            return;
        }

        setLoading(true);

        const response = await api.get(
            `/${type == 'agitator' ? 'users' : 'voters'}/Search?search=${search}&skip=${reset ? 0 : skip}&take=${take}`
        );
        const {data} = await response;

        if (data.length == 0) toast.error('Нет данных')
        if (reset) {
            setResults(data);

            console.log(data.length)
        } else {
            setResults(prev => [...prev, ...data]);
            setSkip(prev => prev + data.length);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false; // пропускаем первый рендер
            return;
        }

        const timer = setTimeout(() => {
            fetchResults(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="p-4 border rounded-md w-full max-w-lg mx-auto">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Поиск ${type === "agitator" ? "агитаторов" : "избирателей"}`}
                className="w-full p-2 border rounded mb-4"
            />

            <ul className="space-y-2">
                {results.map((item) => (
                    <li
                        key={item.id}
                        className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => onUserSelect?.(item.phone)}
                    >
                        <strong>
                            {item.lastName} {item.firstName} {item.middleName || ""}
                        </strong>
                        <div>Телефон: {item.phone}</div>
                        {"uiks" in item && (
                            <div>
                                УИК: {(item.uiks as Agitator["uiks"])
                                .map((u) => u.uik.name)
                                .join(", ")}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
