import { useRegister } from "../../viewmodels/auth/useRegister";

interface RegisterFormProps {
    setMode: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
}

export default function RegisterForm({ setMode }: RegisterFormProps) {
    const {
        form,
        errors,
        handleChange,
        handleSubmit,
        loading,
    } = useRegister();

    return (
        <form
            className="flex flex-col items-center gap-4 w-full sm:w-full md:w-3/4 lg:w-[30%]"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-bold">Create your account</h1>

            <div className="w-full">
                <h2 className="font-medium">Name</h2>
                <input
                    placeholder="Enter your name"
                    value={form.name}
                    type="text"
                    onChange={handleChange("name")}
                    className="p-[0.7rem] rounded-xl border-[#eaebed] border-[1px] w-full text-lg placeholder:text-[#6B7582] focus:outline-none focus:ring-2 focus:ring-[#026d7f]"
                />
                {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
            </div>
            <div className="w-full">
                <h2 className="font-medium">Email</h2>
                <input
                    placeholder="Enter your email"
                    value={form.email}
                    type="email"
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
                    placeholder="Create your password"
                    value={form.password}
                    onChange={handleChange("password")}
                    type="password"
                    className="p-[0.7rem] rounded-xl border-[#eaebed] border-[1px] w-full text-lg placeholder:text-[#697381] focus:outline-none focus:ring-2 focus:ring-[#026d7f]"
                />
                {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
            </div>
            <div className="w-full">
                <h2 className="font-medium">Confirm password</h2>
                <input
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    type="password"
                    className="p-[0.7rem] rounded-xl border-[#eaebed] border-[1px] w-full text-lg placeholder:text-[#697381] focus:outline-none focus:ring-2 focus:ring-[#026d7f]"
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`bg-[#026d7f] rounded-xl text-white p-[0.8rem] w-full font-semibold transition-all duration-250 hover:scale-[0.98] hover:bg-[#048ea1] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
            >
                {loading && (
                    <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
                )}
                {loading ? 'Loading...' : 'Sign Up'}
            </button>


            <p className="text-sm text-[#6B7582]">
                Already have an account?{" "}
                <span
                    className="text-[#026d7f] font-bold hover:text-[#048ea1] transition-colors duration-200 hover:underline underline-offset-2"
                    onClick={() => setMode("login")}
                >
                    Log In
                </span>
            </p>
        </form>
    )
}