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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: ""
  });

  const months = useMemo(() => [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((m, i) => ({ value: i + 1, label: m })), []);

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
    if (!dob.month) return [];
    const year = dob.year ? parseInt(dob.year) : 2024;
    const month = parseInt(dob.month);
    const lastDay = new Date(year, month, 0).getDate();

    return Array.from({ length: lastDay }, (_, i) => ({
      value: i + 1,
      label: (i + 1).toString(),
    }));
  }, [dob.month, dob.year]);

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

      <main className="flex-1 flex flex-col items-center justify-start py-8 px-6 overflow-y-auto">
        <div className="w-full max-sm:max-w-md flex flex-col gap-8 max-w-sm sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">Create Account</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-500">Join us and start managing your links</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black ml-1">Full Name</label>
              <Input type="text" placeholder="Enter your full name" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black ml-1">Email or Phone</label>
              <Input type="text" placeholder="Email or phone number" inputMode="email" />
            </div>

            {/* Date of Birth Section */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black ml-1">Date of Birth</label>
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-1">
                  <Select
                    value={dob.month}
                    onChange={(e) => setDob({ ...dob, month: e.target.value, day: "" })}
                    options={[{ value: "", label: "Month" }, ...months]}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    value={dob.day}
                    onChange={(e) => setDob({ ...dob, day: e.target.value })}
                    disabled={!dob.month}
                    options={[{ value: "", label: "Day" }, ...days]}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    value={dob.year}
                    onChange={(e) => setDob({ ...dob, year: e.target.value })}
                    options={[{ value: "", label: "Year" }, ...years]}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black ml-1">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Create a strong password" />
                <EyeToggle
                  icon={showPassword ? InputImage.eyeOpen : InputImage.eyeClose}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black ml-1">Username</label>
                <Input type="text" placeholder="username" className="pl-10" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" type="submit">Create Account</Button>
            <Button variant="secondary">
              <img src={InputImage.googleImg} alt="Google" className="w-5 h-5" loading="lazy" />
              Sign up with Google
            </Button>
          </div>
        </div>
      </main>

      <footer className="h-18 shrink-0 flex items-center justify-center text-center bg-black text-white">
        Our Terms And Conditions
      </footer>
    </div>
  );
}

