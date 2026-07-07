import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFetch } from "../../utils/getFetch"
import { RegisterSchema, type RegisterInput } from "../../schemas/auth-schemas"
import { toast } from "sonner"
import { useAppDispatch } from "../../store/store"
import { setUser } from "../../store/slices/auth-slice"
import type { User } from "../../types/user-types"
import {
  EnvelopeSimpleIcon,
  LockSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  WarningCircleIcon,
  CircleNotchIcon,
  ShieldCheckIcon,
  UserIcon
} from "@phosphor-icons/react"

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    return getFetch<{ message?: string; data: { user: User } }>("/auth/register", {
      method: "POST",
      body: data,
      private: true,
    })
      .then((resData) => {
        toast.success(resData?.message || "Successfully registered!")
        dispatch(setUser(resData?.data?.user || null))
        navigate("/")
      })
      .catch((err) => {
        const errorMsg = err?.message || "Registration failed. Please try again."
        toast.error(errorMsg)
      })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-12 select-none">
      {/* Register Card */}
      <div className="w-full max-w-md bg-background-card border border-border rounded-3xl shadow-xl p-5 sm:p-8 transition-all duration-300">

        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <ShieldCheckIcon size={28} weight="duotone" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight font-poppins">Create Account</h2>
          <p className="text-sm text-secondary mt-1 text-center">Get started by creating your dashboard account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name & Last Name */}
          <div className="grid 2xs:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 inset-s-0 ps-4 flex items-center pointer-events-none text-secondary">
                  <UserIcon size={20} />
                </div>
                <input
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                  className="w-full ps-11 pe-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <WarningCircleIcon size={16} />
                  <span>{errors.firstName.message}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 inset-s-0 ps-4 flex items-center pointer-events-none text-secondary">
                  <UserIcon size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Doe"
                  {...register("lastName")}
                  className="w-full ps-11 pe-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <WarningCircleIcon size={16} />
                  <span>{errors.lastName.message}</span>
                </p>
              )}
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Password</label>
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
            className="w-full flex items-center justify-center py-3 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all select-none"
          >
            {isSubmitting ? (
              <CircleNotchIcon size={20} className="animate-spin text-white" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Login Footer */}
        <p className="mt-8 text-center text-xs font-semibold text-secondary">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}