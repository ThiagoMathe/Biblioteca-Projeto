import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { useBookManagement } from "../../viewmodels/admin/useBookManagement";
import { Book } from "../../models/book"
import { useState } from "react";
import BookModal from "../../components/BookModal";

const columns: { key: keyof Book; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "format", label: "Format" },
    { key: "genre", label: "Genre" },
    { key: "availability", label: "Availability" },
    { key: "pubDate", label: "Publication Date" },
]

export default function BookManagementPage() {
    const {
        books,
        totalPages,
        sortConfig,
        currentPage,
        inputSearchTerm,
        setInputSearchTerm,
        setSortConfig,
        setCurrentPage,
        onInputKeyDown,
    } = useBookManagement()
    const [modal, setModal] = useState<boolean>(false)

    const renderSortIcon = (key: keyof Book) => {
        if (sortConfig?.key !== key) return null;

        return sortConfig.direction === "asc" ? (
            <ChevronUp size={16} className="inline-block" />
        ) : (
            <ChevronDown size={16} className="inline-block" />
        );
    };

    return (
        <main className="h-full flex-1 overflow-hidden px-12 py-9 flex flex-col gap-6">

            {modal && (
                <BookModal close={() => setModal(false)} />
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Books</h1>
                <button
                    className="bg-[#ebedf2] rounded-2xl py-1 px-4 font-medium text-sm hover:bg-[#e0e2e8] transition"
                    onClick={(() => { setModal(true) })}
                >
                    Add Book
                </button>
            </div>

            <div className="relative w-full flex gap-2">
                <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Search by title, author or genre"
                    value={inputSearchTerm}
                    onChange={(e) => setInputSearchTerm(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    className="flex-grow p-2 pl-10 border border-[#dee0e5] text-[#10151a] placeholder:text-[#5C738A] bg-[#ebedf2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
            </div>

            <section
                aria-label="Book table"
                className="flex-1 overflow-auto rounded-lg border border-gray-200"
            >
                <table className="w-full border-collapse table-auto text-sm text-left text-gray-500">
                    <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0 z-10">
                        <tr>
                            {columns.map(({ key, label }) => (
                                <th
                                    key={key}
                                    className="px-4 py-3 cursor-pointer select-none bg-gray-100"
                                    onClick={() => setSortConfig(key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        {renderSortIcon(key)}
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 py-3 bg-gray-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? (
                            books.map((book, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 font-semibold text-gray-900">
                                        {book.title}
                                    </td>
                                    <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                                        {book.author}
                                    </td>
                                    <td className="px-4 py-3 w-44">{book.format}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 w-36 text-center">
                                            {book.genre}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold w-24 text-center ${book.availability === "Available"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-red-200 text-red-800"
                                                }`}
                                        >
                                            {book.availability}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 w-44">{book.pubDate}</td>
                                    <td className="px-4 py-3 text-blue-700 font-medium flex gap-1 flex-wrap">
                                        <button className="hover:underline">Edit</button>|
                                        <button className="hover:underline">Remove</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-4 text-center text-gray-400">
                                    No books found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            <div className="flex justify-end items-center gap-2 text-sm mt-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </main>
    )
}