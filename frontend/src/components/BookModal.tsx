import { useEffect, useState } from 'react';
import Dropzone from './ui/Dropzone';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import Swal from 'sweetalert2';

interface BookModalProps {
    modal: {
        type: "add" | "edit" | null,
        info: Book | null
    }
    close: Function
    bookChange: (book: Book) => void
}

export default function BookModal({ modal, close, bookChange }: BookModalProps) {
    const [formData, setFormData] = useState<Book>({
        id: -1,
        title: '',
        description: '',
        author: '',
        genre: '',
        format: "",
        pubDate: '',
        availability: true,
        imageBase64: '',
    });

    useEffect(() => {
        if (modal.info != null) {
            setFormData(modal.info)
        }
    }, [modal.info])

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => {
            const updated = {
                ...prev,
                [field]: field === 'availability' ? value === 'true' : value,
            };

            if (field === 'format' && value !== 'Physic') {
                updated.availability = true;
            }

            return updated;
        });
    };

    const validateForm = () => {
        const { title, author, genre, format, pubDate } = formData;

        if (!title.trim() || !author.trim() || !genre || !format || !pubDate) {
            setErrorMessage(`Please fill out all fields before ${modal.type === "add" ? "adding" : "editing"} a book.`);
            return false;
        }

        if (modal.info === formData) {
            setErrorMessage("nenhuma mudança!");
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || modal.type === null) return;

        const isAdd = modal.type === "add";
        const successMsg = isAdd ? 'The book was successfully added.' : 'The book was successfully updated.';
        const errorMsg = isAdd ? 'Failed to add the book.' : 'Failed to update the book.';

        let res: Book | null = null;
        try {
            if (isAdd) {
                const { id, ...formDataWithoutId } = formData
                res = await BookService.add(formDataWithoutId);
            } else {
                res = await BookService.update(formData);
            }
            if (res) bookChange(res);

            Swal.fire({
                icon: 'success',
                title: isAdd ? 'Added!' : 'Updated!',
                text: successMsg,
                showConfirmButton: false,
                timer: 2000,
            });

            close();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMsg,
            });
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[1.5px] flex justify-center items-center z-50'>
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg m-4">
                <h2 className="text-2xl font-bold ">
                    {modal.type == "add" ? "Add New" : "Edit"} Book
                </h2>
                {errorMessage && (
                    <p className="text-sm text-red-600 -mb-6 mt-1">{errorMessage}</p>
                )}

                <form className="space-y-4 mt-7" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='title' className="block mb-1 font-medium">Title</label>
                        <input
                            id='title'
                            type="text"
                            placeholder="Book title"
                            className="w-full border rounded-lg px-4 py-2"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                        <label htmlFor='description' className="block mb-1 font-medium">Description</label>
                        <textarea
                            id='description'
                            placeholder="Book description"
                            className="w-full border rounded-lg px-4 py-2 resize-none h-20 "
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col">
                            <label htmlFor='author' className="block mb-1 font-medium">Author</label>
                            <input
                                id='author'
                                type="text"
                                placeholder="Author name"
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.author}
                                onChange={(e) => handleChange('author', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label htmlFor='genre' className="block mb-1 font-medium">Genre</label>
                            <select
                                id='genre'
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.genre}
                                onChange={(e) => handleChange('genre', e.target.value)}
                            >
                                <option value="">Select a genre</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Romance">Romance</option>
                                <option value="Mystery">Mystery</option>
                                <option value="Sci-Fi">Sci-Fi</option>
                                <option value="Fantasy">Fantasy</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col">
                            <label htmlFor='format' className="block mb-1 font-medium">Format</label>
                            <select
                                id='format'
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.format}
                                onChange={(e) => handleChange('format', e.target.value)}
                            >
                                <option value="">Select a format</option>
                                <option value="Physic">Physic</option>
                                <option value="Digital">Digital</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label htmlFor='pubDate' className="block mb-1 font-medium">Publication Date</label>
                            <input
                                id='pubDate'
                                type="date"
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.pubDate}
                                onChange={(e) => handleChange('pubDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <Dropzone />

                    <div>
                        <label className="block mb-2 font-medium">Availability</label>
                        <div className="flex gap-6">
                            <label htmlFor="availability-true" className="flex items-center gap-2">
                                <input
                                    id='availability-true'
                                    type="radio"
                                    value="true"
                                    checked={formData.availability === true}
                                    onChange={() => handleChange('availability', 'true')}
                                    disabled={formData.format !== 'Physic'}
                                />
                                Available
                            </label>

                            <label htmlFor="availability-false" className="flex items-center gap-2">
                                <input
                                    id='availability-false'
                                    type="radio"
                                    value="false"
                                    checked={formData.availability === false}
                                    onChange={() => handleChange('availability', 'false')}
                                    disabled={formData.format !== 'Physic'}
                                />
                                Unavailable
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                            onClick={() => { close() }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {modal.type === "add" ? "Add" : "Edit"} Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}