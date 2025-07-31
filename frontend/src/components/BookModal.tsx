import { useState } from 'react';
import Dropzone from './ui/Dropzone';

interface BookModalProps {
    close: Function
}

export default function BookModal({ close }: BookModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        format: '',
        publicationDate: '',
        availability: 'Available' as 'Available' | 'Borrowed'
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            availability: field === 'format' && value !== 'Physic' ? 'Available' : prev.availability
        }));
    };

    const validateForm = () => {
        const today = new Date().toISOString().split('T')[0];
        const { title, author, genre, format, publicationDate } = formData;

        if (!title.trim() || !author.trim() || !genre || !format || !publicationDate) {
            setErrorMessage('Please fill out all fields before adding a book.');
            return false;
        }

        if (publicationDate > today) {
            setErrorMessage('Publication date cannot be in the future.');
            return false;
        }

        setErrorMessage('');
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        /* mudar pra api */
        console.log(formData);
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[1.5px] flex justify-center items-center z-50'>
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg m-4">
                <h2 className="text-2xl font-bold ">Add New Book</h2>
                {errorMessage && (
                    <p className="text-sm text-red-600 -mb-6 mt-1">{errorMessage}</p>
                )}

                <form className="space-y-4 mt-7" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            type="text"
                            placeholder="Book title"
                            className="w-full border rounded-lg px-4 py-2"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col">
                            <label className="block mb-1 font-medium">Author</label>
                            <input
                                type="text"
                                placeholder="Author name"
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.author}
                                onChange={(e) => handleChange('author', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-1 flex-col">
                            <label className="block mb-1 font-medium">Genre</label>
                            <select
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
                            <label className="block mb-1 font-medium">Format</label>
                            <select
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
                            <label className="block mb-1 font-medium">Publication Date</label>
                            <input
                                type="date"
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.publicationDate}
                                onChange={(e) => handleChange('publicationDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <Dropzone />

                    <div>
                        <label className="block mb-2 font-medium">Availability</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="Available"
                                    checked={formData.availability === 'Available'}
                                    onChange={() => handleChange('availability', 'Available')}
                                    disabled={formData.format !== 'Physic'}
                                />
                                Available
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="Borrowed"
                                    checked={formData.availability === 'Borrowed'}
                                    onChange={() => handleChange('availability', 'Borrowed')}
                                    disabled={formData.format !== 'Physic'}
                                />
                                Borrowed
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
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}