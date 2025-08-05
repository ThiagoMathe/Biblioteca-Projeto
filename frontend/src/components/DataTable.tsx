import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
};

type SortConfig<T> = {
    key: keyof T;
    direction: "asc" | "desc";
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    renderActions?: (row: T) => React.ReactNode;
};

export function DataTable<T extends object>({
    columns,
    data,
    renderActions,
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
        columns.length > 0 ? { key: columns[0].key, direction: "desc" } : null
    );
    const [sortedData, setSortedData] = useState<T[]>(data);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let sortableData = [...data];

        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (typeof aVal === "string" && typeof bVal === "string") {
                    const result = aVal.localeCompare(bVal);
                    return sortConfig.direction === "asc" ? result : -result;
                }

                if (typeof aVal === "number" && typeof bVal === "number") {
                    return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal);
                const bStr = String(bVal);
                const result = aStr.localeCompare(bStr);
                return sortConfig.direction === "asc" ? result : -result;
            });
        }

        setSortedData(sortableData);
    }, [data, sortConfig]);

    useEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [data])

    const handleSort = (key: keyof T) => {
        let direction: "asc" | "desc" = "asc";

        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key, direction });
    };

    const renderSortIcon = (key: keyof T) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? (
            <ChevronUp size={16} className="inline-block" />
        ) : (
            <ChevronDown size={16} className="inline-block" />
        );
    };

    return (
        <section
            aria-label="table"
            ref={sectionRef}
            className="flex-1 overflow-auto rounded-lg sm:border sm:border-gray-200 border-0 border-transparent"
        >
            {/* Mobile view */}
            <div className="sm:hidden flex flex-col gap-4">
                {sortedData.length > 0 ? (
                    sortedData.map((row, i) => (
                        <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
                            {columns.map(({ key, label, render }, colIndex) => (
                                <div key={String(key)} className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-600">{label}</span>
                                    <span className={colIndex === 0 ? "text-gray-900 font-semibold text-base" : "text-gray-700"}>
                                        {render ? render(row[key], row) : String(row[key])}
                                    </span>
                                </div>
                            ))}
                            {renderActions && (
                                <div className="mt-2 text-blue-700 font-medium flex gap-2 flex-wrap">
                                    {renderActions(row)}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No data found.</p>
                )}
            </div>
            {/* Desktop/tablet view */}
            <table className="hidden sm:table w-full border-collapse table-auto text-sm text-left text-gray-500 border-gray-200">
                <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0 z-10">
                    <tr>
                        {columns.map(({ key, label }) => (
                            <th
                                key={String(key)}
                                className="px-4 py-3 cursor-pointer select-none bg-gray-100"
                                onClick={() => handleSort(key)}
                            >
                                <div className="flex items-center gap-1">
                                    {label}
                                    {renderSortIcon(key)}
                                </div>
                            </th>
                        ))}
                        {renderActions && <th className="px-4 py-3 bg-gray-100">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((row, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                {columns.map(({ key, render }, colIndex) => (
                                    <td
                                        key={String(key)}
                                        className={
                                            colIndex === 0
                                                ? "px-4 py-4 text-[1.10rem] font-semibold text-gray-900"
                                                : "px-4 py-4 text-[1rem] font-semibold text-gray-500"
                                        }
                                    >
                                        {render ? render(row[key], row) : String(row[key])}
                                    </td>
                                ))}
                                {renderActions && (
                                    <td className="px-4 py-3 text-blue-700 font-medium flex gap-2 flex-wrap">
                                        {renderActions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (renderActions ? 1 : 0)}
                                className="px-4 py-4 text-center text-gray-400"
                            >
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}