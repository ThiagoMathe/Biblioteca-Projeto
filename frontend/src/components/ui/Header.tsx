export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex bg-[#f7fafc] gap-4 justify-center sm:pl-8  sm:justify-start  w-full border-b-[1px] border-[#e8eaed] py-3  items-center">
            <img src="logo.png" className="w-5" />
            <h3 className="font-bold text-lg">BookHaven</h3>
        </header>
    )
}