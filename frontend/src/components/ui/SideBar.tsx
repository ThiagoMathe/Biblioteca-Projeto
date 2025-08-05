import { Link, useLocation } from 'react-router-dom'
import { Book, History, Home, Users, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'book-management', label: 'Book Management', icon: Book },
  { id: 'user-management', label: 'User Management', icon: Users },
  { id: 'borrow-history', label: 'Borrow History', icon: History },
]

export function Sidebar() {
  const [selected, setSelected] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const current = location.pathname.split('/')[1] || 'dashboard'
    setSelected(current)
    setIsMobileMenuOpen(false)
  }, [location])

  const renderLinks = () => (
    <nav className="flex flex-col gap-3">
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
            <div className="w-6 h-6 flex items-center justify-center">
              <Icon
                className="w-5 h-5"
                stroke={isActive ? 'black' : '#6B7280'}
                strokeWidth={2}
              />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      <div className="sm:hidden p-4 flex justify-between items-center bg-[#fafafa] shadow-md px-8">
        <h1 className="text-lg font-semibold">Menu</h1>
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#fafafa] px-6 pt-4 pb-6 shadow-md">
          {renderLinks()}
        </div>
      )}

      <aside className="hidden sm:flex bg-[#fafafa] flex-col px-6 pr-8 pt-10 gap-3 min-w-[20rem]">
        {renderLinks()}
      </aside>
    </>
  )
}
