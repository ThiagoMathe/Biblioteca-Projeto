export default function NotFoundPage() {
    return (
        <div className="flex gap-2 flex-col items-center justify-center min-h-screen">

            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-xl mt-4">Page not found</p>
            <img
                src="bookhaven-readers.png"
                className="w-[20%]"
            />
        </div>
    );
}