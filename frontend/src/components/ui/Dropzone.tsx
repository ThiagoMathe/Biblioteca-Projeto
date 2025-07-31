import { ImageUp } from 'lucide-react';
import { useState } from 'react';

export default function Dropzone() {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#e6e8ec] border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 transition-all duration-300">
                    {!preview ? (
                        <>
                            <ImageUp className="w-10 h-10 mb-2 text-gray-500 transition-transform duration-300 hover:scale-110" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold text-blue-600 hover:underline cursor-pointer">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                        </>
                    ) : (
                        <img
                            src={preview}
                            alt="preview"
                            className="h-36 object-contain rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
                        />
                    )}
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}