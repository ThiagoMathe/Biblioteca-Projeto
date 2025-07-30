import { Link } from "react-router-dom";
import { useLogin } from "../../viewmodels/auth/useLogin";

interface LoginFormProps {
    setMode: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
}

export default function LoginForm({ setMode }: LoginFormProps) {
    const {
        form,
        errors,
        handleChange,
        handleSubmit,
        loading,
    } = useLogin();
    return (
        <form
            className="flex flex-col items-center gap-4 w-full sm:w-full md:w-3/4 lg:w-[30%]"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-bold">Welcome back</h1>

            <div className="w-full">
                <h2 className="font-medium">Email</h2>
                <input
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="p-[0.7rem] rounded-xl border-[#eaebed] border-[1px] w-full text-lg placeholder:text-[#6B7582] focus:outline-none focus:ring-2 focus:ring-[#026d7f]"
                />
                {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
            </div>

            <div className="w-full">
                <h2 className="font-medium">Password</h2>
                <input
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange("password")}
                    type="password"
                    className="p-[0.7rem] rounded-xl border-[#eaebed] border-[1px] w-full text-lg placeholder:text-[#697381] focus:outline-none focus:ring-2 focus:ring-[#026d7f]"
                />
                {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
            </div>

            <Link
                to="/forgot-password"
                className="self-start text-sm text-[#6B7582] font-semibold transition-all duration-150 hover:text-[#4b5563] hover:underline underline-offset-2"
            >
                Forgot password?
            </Link>

            <button
                type="submit"
                disabled={loading}
                className={`bg-[#026d7f] rounded-xl text-white p-[0.8rem] w-full font-semibold transition-all duration-250 hover:scale-[0.98] hover:bg-[#048ea1] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
            >
                {loading && (
                    <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
                )}
                {loading ? 'Loading...' : 'Log In'}
            </button>


            <p className="text-sm text-[#6B7582]">
                Don't have an account?{" "}
                <span
                    className="text-[#026d7f] font-bold hover:text-[#048ea1] transition-colors duration-200 hover:underline underline-offset-2"
                    onClick={() => setMode("register")}
                >
                    Sign Up
                </span>
            </p>
        </form>
    )
}