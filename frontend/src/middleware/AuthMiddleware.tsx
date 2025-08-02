import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Sidebar } from '../components/ui/SideBar'

const AuthMiddleware = () => {
    const location = useLocation()
    const token = Cookies.get('authToken')

    if (!token) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return (
        <div className='h-[calc(100vh-53px)] flex sm:flex-row flex-col w-full'>
            <Sidebar />
            <main className='flex-1 overflow-hidden bg-[#fafafa]'>
                <Outlet />
            </main>
        </div>
    )

}

export default AuthMiddleware
