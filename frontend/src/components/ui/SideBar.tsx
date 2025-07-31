import { Link, useLocation } from 'react-router-dom'
import { Book, History, Home, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const items = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'book-management', label: 'Book Management', icon: Book },
    { id: 'users-managament', label: 'User Management', icon: Users },
    { id: 'borrow-historiy', label: 'Borrow History', icon: History },
]

export function Sidebar() {
    const [selected, setSelected] = useState('')
    const location = useLocation()

    useEffect(() => {
        const current = location.pathname.split('/')[1] || 'dashboard'
        setSelected(current)
    }, [location])

    return (
        <aside className=" bg-[#fafafa] flex flex-col md:w-[24rem] pl-12 pr-8 pt-10 gap-3 sm:w-full">
            {items.map(({ id, label, icon: Icon }) => {
                const isActive = selected === id
                return (
                    <Link
                        to={`/${id}`}
                        key={id}
                        onClick={() => setSelected(id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setSelected(id)
                        }}
                        aria-selected={isActive}
                        className={`group flex items-center gap-3 px-4 py-2 rounded-3xl cursor-pointer transition 
                        ${isActive
                                ? 'bg-[#ebedf2] text-[#10151a]'
                                : 'hover:bg-[#ebedf2] text-[#5C738A]'
                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400`}
                    >
                        <div className={"w-6 h-6 flex items-center justify-center"}>
                            <Icon
                                className="w-4 h-4"
                                stroke={isActive ? 'black' : '#6B7280'}
                                strokeWidth={2}
                            />
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                    </Link>
                )
            })}
        </aside>
    )
}
