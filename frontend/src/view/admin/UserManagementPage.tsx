import { Column, DataTable } from "../../components/DataTable";
import SearchInput from "../../components/ui/SearchInput";
import Pagination from "../../components/Pagination";
import { User } from "../../models/user";
import { useUserManagement } from "../../viewmodels/admin/useUserManagement";

const userColumns: Column<User>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
        key: "status",
        label: "Status",
        render: (value: string) => {
            const color =
                value.toLocaleUpperCase() === "ACTIVE"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"

            return (
                <span className={`inline-block w-20  text-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
                    {value}
                </span>
            );
        },
    },
    { key: "joinedDate", label: "Joined Date" },
];

export default function UserManagementPage() {
    /*  mudar: viewmodel */
    const {
        state: { users, totalPages, currentPage, inputSearchTerm, viewModal },
        setters: { setInputSearchTerm, setCurrentPage, setViewModal },
        handlers: { onInputKeyUp },
    } = useUserManagement();

    return (
        <main className="h-full flex-1 overflow-hidden px-8 py-9 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Members</h1>

            <SearchInput
                value={inputSearchTerm}
                onChange={(e) => setInputSearchTerm(e.target.value)}
                onKeyUp={onInputKeyUp}
                placeholder="Search members"
            />

            <DataTable<User>
                columns={userColumns}
                data={users}
                renderActions={() => (
                    <button className="text-blue-600 hover:underline">View</button>
                )}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </main>
    )
}