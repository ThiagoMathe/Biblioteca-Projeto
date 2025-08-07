import { useEffect, useState } from "react";
import { Column, DataTable } from "../../components/DataTable";
import { Borrow } from "../../models/borrow";
import { DashboardData } from "../../models/dashboard";
import { dashboardService } from "../../services/dashboard.service";

export const borrowHistoryColumns: Column<Borrow>[] = [
    {
        key: "bookTitle",
        label: "Book Title",
    },
    {
        key: "userName",
        label: "Borrower",
    },
    {
        key: "borrowedAt",
        label: "Borrow Date",
        render: (value) =>
            new Date(value).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
    },
    {
        key: "returnedAt",
        label: "Return Date",
        render: (value) =>
            value
                ? new Date(value).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "Not returned",
    },
];

export default function DashBoardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await dashboardService.get();
                setDashboardData(res);
            } catch (err: any) {
                console.error("Error fetching dashboard data", err);
            }
        }
        fetchDashboard();
    }, []);

    if (!dashboardData) return null;

    return (
        <main className="h-full flex-1 overflow-hidden px-8 py-9 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">DashBoard</h1>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
                <div className="bg-[#EBEDF2] p-8 py-10 flex flex-col justify-center rounded-lg">
                    <p>Total Books</p>
                    <p className="text-2xl font-semibold">{dashboardData.totalBooks}</p>
                </div>
                <div className="bg-[#EBEDF2] p-8 py-10 flex flex-col justify-center rounded-lg">
                    <p>Total Users</p>
                    <p className="text-2xl font-semibold">{dashboardData.totalUsers}</p>
                </div>
                <div className="bg-[#EBEDF2] p-8 py-10 flex flex-col justify-center rounded-lg">
                    <p>Books Returned</p>
                    <p className="text-2xl font-semibold">{dashboardData.totalReturned}</p>
                </div>
            </section>

            <h1 className="text-xl font-bold">Recent Activity</h1>

            <DataTable columns={borrowHistoryColumns} data={dashboardData.recentBorrowHistory} />
        </main>
    );
}