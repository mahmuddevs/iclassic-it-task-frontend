import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "../../store/store"
import { setUser } from "../../store/slices/auth-slice"
import { getFetch } from "../../utils/getFetch"
import { LoginSchema, type LoginInput } from "../../schemas/auth-schemas"
import { toast } from "sonner"
import type { User } from "../../types/user-types"
import {
  EnvelopeSimpleIcon,
  LockSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  WarningCircleIcon,
  CircleNotchIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react"

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const populateForm = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true })
    setValue("password", password, { shouldValidate: true })
  }

  const onSubmit = async (data: LoginInput) => {
    return getFetch<{ message?: string; data: { user: User } }>("/auth/login", {
      method: "POST",
      body: data,
      private: true,
    })
      .then((resData) => {
        toast.success(resData?.message || "Successfully logged in!")
        dispatch(setUser(resData?.data?.user || null))
        navigate("/")
      })
      .catch((err) => {
        const errorMsg = err?.message || "Invalid credentials. Please try again."
        toast.error(errorMsg)
      })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-12 select-none">
      {/* Login Card */}
      <div className="w-full max-w-md bg-background-card border border-border rounded-3xl shadow-xl p-5 sm:p-8  transition-all duration-300">

        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <ShieldCheckIcon size={28} weight="duotone" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight font-poppins">Welcome Back</h2>
          <p className="text-sm text-secondary mt-1 text-center">Enter your details to access the dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 inset-s-0 ps-4 flex items-center pointer-events-none text-secondary">
                <EnvelopeSimpleIcon size={20} />
              </div>
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                className="w-full ps-11 pe-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 inset-s-0 ps-4 flex items-center pointer-events-none text-secondary">
                <LockSimpleIcon size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full ps-11 pe-12 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 inset-e-0 pe-4 flex items-center text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all hover:shadow-md hover:shadow-primary/10 active:scale-98 select-none duration-150"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <CircleNotchIcon size={18} className="animate-spin text-white" />
                <span>Signing In...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-border space-y-3">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-wider text-center">
            Quick demo login
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => populateForm("admin@example.com", "password123")}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:border-primary text-primary hover:text-white transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <span className="text-xs font-bold">Admin</span>
              <span className="text-[9px] opacity-75 font-medium text-center leading-tight">Full Access</span>
            </button>
            <button
              type="button"
              onClick={() => populateForm("manager@example.com", "password123")}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:border-amber-500 text-amber-600 dark:text-amber-400 hover:text-white transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <span className="text-xs font-bold">Manager</span>
              <span className="text-[9px] opacity-75 font-medium text-center leading-tight">Staff & Stock</span>
            </button>
            <button
              type="button"
              onClick={() => populateForm("employee@example.com", "password123")}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary hover:border-secondary text-secondary hover:text-white transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              <span className="text-xs font-bold">Employee</span>
              <span className="text-[9px] opacity-75 font-medium text-center leading-tight">Basic View</span>
            </button>
          </div>
        </div>

        {/* Register Footer */}
        <p className="mt-8 text-center text-xs font-semibold text-secondary">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary hover:text-primary/80 transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  )
}