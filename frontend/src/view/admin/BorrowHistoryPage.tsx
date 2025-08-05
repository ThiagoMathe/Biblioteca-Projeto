import { Borrow } from "../../models/borrow";
import { useBorrowHistory } from "../../viewmodels/admin/useBorrowHistory";
import SearchInput from "../../components/ui/SearchInput";
import { Column, DataTable } from "../../components/DataTable";
import Pagination from "../../components/Pagination";

const borrowColumns: Column<Borrow>[] = [
    { key: "userName", label: "User" },
    { key: "bookTitle", label: "Book" },
    {
        key: "borrowedAt",
        label: "Borrowed Date",
        render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
        key: "returnedAt",
        label: "Returned Date",
        render: (value: string | null) => value ? new Date(value).toLocaleDateString() : "-"
    },
    {
        key: "status",
        label: "Status",
        render: (value: string) => {
            const color =
                value.toLowerCase() === "returned"
                    ? "bg-green-200 text-green-800"
                    : value.toLowerCase() === "late"
                        ? "bg-red-200 text-red-800"
                        : value.toLowerCase() === "active"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800";
            return (
                <span className={`inline-block w-24 bg-[#ebedf2] text-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
                    {value}
                </span>
            )
        },
    },
];

export default function BorrowHistoryPage() {
    const {
        state: { borrows, totalPages, currentPage, inputSearchTerm },
        setters: { setInputSearchTerm, setCurrentPage },
        handlers: { onInputKeyUp },
    } = useBorrowHistory();

    return (
        <main className="h-full flex-1 overflow-hidden px-8 py-9 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">History</h1>

            <SearchInput
                value={inputSearchTerm}
                onChange={(e) => setInputSearchTerm(e.target.value)}
                onKeyUp={onInputKeyUp}
                placeholder="Search by user or book"
            />

            <DataTable<Borrow> columns={borrowColumns} data={borrows} />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </main>
    );
}