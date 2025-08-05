import { useBookManagement } from "../../viewmodels/admin/useBookManagement";
import { Book } from "../../models/book"
import BookModal from "../../components/BookModal";
import { Column, DataTable } from "../../components/DataTable";
import SearchInput from "../../components/ui/SearchInput";
import Pagination from "../../components/Pagination";

const bookColumns: Column<Book>[] = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "format", label: "Format" },
    { key: "genre", label: "Genre" },
    {
        key: "availability",
        label: "Availability",
        render: (value: boolean) => (
            <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold w-24 text-center ${value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}
            >
                {value ? "Available" : "Unavailable"}
            </span>
        ),
    },
    { key: "pubDate", label: "Publication Date" },
];

export default function BookManagementPage() {
    const {
        state: { books, totalPages, currentPage, inputSearchTerm, bookFormModal, removeConfirmation },
        setters: { setInputSearchTerm, setCurrentPage, setBookFormModal, setRemoveConfirmation },
        handlers: { onInputKeyUp, applyBookChange, removeBook },
    } = useBookManagement();

    return (
        <main className="h-full flex-1 overflow-hidden px-8 py-9 flex flex-col gap-6">
            {bookFormModal.type != null && (
                <BookModal modal={bookFormModal} close={() => setBookFormModal(null)} bookChange={applyBookChange} />
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Books</h1>
                <button
                    className="bg-[#ebedf2] rounded-2xl py-1 px-4 font-medium text-sm hover:bg-[#e0e2e8] transition"
                    onClick={(() => { setBookFormModal('add') })}
                >
                    Add Book
                </button>
            </div>

            <SearchInput
                value={inputSearchTerm}
                onChange={(e) => setInputSearchTerm(e.target.value)}
                onKeyUp={onInputKeyUp}
                placeholder="Search by title, author or genre"
            />

            <DataTable<Book>
                columns={bookColumns}
                data={books}
                renderActions={(book) =>
                    removeConfirmation.id === book.id && removeConfirmation.visible ? (
                        <div className="flex gap-2 text-blue-700 font-medium flex-wrap">
                            <button
                                className="text-gray-600 hover:underline"
                                onClick={() => setRemoveConfirmation(false)}
                            >
                                Cancel
                            </button>
                            |
                            <button
                                className="text-red-600 hover:underline"
                                onClick={() => removeBook(book.id)}
                            >
                                Confirm
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className="hover:underline"
                                onClick={() => setBookFormModal("edit", book)}
                            >
                                Edit
                            </button>
                            |
                            <button
                                className="hover:underline text-red-600"
                                onClick={() => setRemoveConfirmation(true, book.id)}
                            >
                                Remove
                            </button>
                        </div>
                    )
                }
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </main>
    )
}