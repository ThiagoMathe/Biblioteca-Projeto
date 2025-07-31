import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Sidebar } from '../components/ui/SideBar'

const AuthMiddleware = () => {
    const token = Cookies.get('token')
    /*  MUDAR! MELHORAR GESTÃO DO TOKEN! */
    if (token) {
        return <Navigate to="/auth" />
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
