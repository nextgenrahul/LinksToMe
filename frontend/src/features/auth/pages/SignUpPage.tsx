import "@/assets/css/logo.css";
import { useState, useMemo } from "react";
import { InputImage } from "@/assets/input";
import LeftArrow from "@/assets/leftArrow.svg";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import EyeToggle from "@/components/ui/EyeToggle";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PATHS } from "@/constants/paths";
import type { SignupForm } from "../types";
import { validateSchema } from "@/shared/utils/validation";
import { SignupPayloadSchema } from "@linkstome/shared";
import apiClient from "@/shared/api/apiClient";
import { useAppDispatch } from "../../../store/hooks";
import { bootstrapAuth } from "../store/authSlice";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    dob: {
      day: "",
      month: "",
      year: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    if (name.startsWith("dob.")) {
      const key = name.split(".")[1] as keyof SignupForm["dob"];
      setForm((prev) => ({
        ...prev,
        dob: {
          ...prev.dob,
          [key]: value,
          ...(key == "month" || key == "year" ? { day: "" } : {}),
        },
      }));

      setErrors((prev) => ({
        ...prev,
        birthday: "",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const months = useMemo(
    () =>
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((m, i) => ({ value: i + 1, label: m })),
    [],
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1986;
    const yearList = [];
    for (let y = currentYear; y >= startYear; y--) {
      yearList.push({ value: y, label: y.toString() });
    }
    return yearList;
  }, []);

  const days = useMemo(() => {
    if (!form.dob.month) return [];
    const year = form.dob.year ? parseInt(form.dob.year) : 2024;
    const month = parseInt(form.dob.month);
    const lastDay = new Date(year, month, 0).getDate();

    return Array.from({ length: lastDay }, (_, i) => ({
      value: i + 1,
      label: (i + 1).toString(),
    }));
  }, [form.dob.month, form.dob.year]);

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      const dataToValidate = {
        email: form.email,
        username: form.username,
        password: form.password,
        name: form.fullName,
        birthday: {
          day: Number(form.dob.day),
          month: Number(form.dob.month),
          year: Number(form.dob.year),
        },
      };

      const { isValid, errors: validationErrors } = validateSchema(
        SignupPayloadSchema,
        dataToValidate,
      );

      if (!isValid) {
        setErrors(validationErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setIsLoading(true);

      await apiClient.post("/auth/signup", dataToValidate);
      await dispatch(bootstrapAuth()).unwrap();

      setErrors({});
      setForm({
        fullName: "",
        email: "",
        username: "",
        password: "",
        dob: {
          day: "",
          month: "",
          year: "",
        },
      });
      setTimeout(() => {
        navigate(PATHS.HOME);
      }, 1000);
    } catch (error) {
      console.error("Signup Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex items-center pointer-events-none">
        <button
          onClick={() => navigate(PATHS.LOGIN)}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group pointer-events-auto"
        >
          <img
            src={LeftArrow}
            alt="Back"
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            loading="lazy"
          />
          <span className="font-bold text-sm hidden sm:inline">
            Back to Login
          </span>
        </button>
      </header>

      <form onSubmit={createAccount}>
        <main className="flex-1 flex flex-col items-center justify-start py-8 px-6 overflow-y-auto">
          <div className="w-full max-sm:max-w-md flex flex-col gap-8 max-w-sm sm:max-w-md">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-black">
                Create Account
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Join us and start managing your links
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-black ml-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-black ml-1">
                  Email or Phone
                </label>
                <Input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email or phone number"
                  inputMode="email"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Date of Birth Section */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-black ml-1">
                  Date of Birth
                </label>
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1">
                    <Select
                      value={form.dob.month}
                      name="dob.month"
                      onChange={handleChange}
                      options={[{ value: "", label: "Month" }, ...months]}
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={form.dob.day}
                      name="dob.day"
                      onChange={handleChange}
                      disabled={!form.dob.month}
                      options={[{ value: "", label: "Day" }, ...days]}
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={form.dob.year}
                      name="dob.year"
                      onChange={handleChange}
                      options={[{ value: "", label: "Year" }, ...years]}
                    />
                  </div>
                </div>
                {errors.birthday && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.birthday}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-black ml-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {errors.password}
                    </p>
                  )}
                  <EyeToggle
                    icon={
                      showPassword ? InputImage.eyeOpen : InputImage.eyeClose
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-black ml-1">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="username"
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              <Button variant="secondary">
                <img
                  src={InputImage.googleImg}
                  alt="Google"
                  className="w-5 h-5"
                  loading="lazy"
                />
                Sign up with Google
              </Button>
            </div>
          </div>
        </main>
      </form>
      <footer className="h-18 shrink-0 flex items-center justify-center text-center bg-black text-white">
        Our Terms And Conditions
      </footer>
    </div>
  );
}
