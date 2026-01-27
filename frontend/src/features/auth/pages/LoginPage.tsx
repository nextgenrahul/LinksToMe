import "@/assets/css/logo.css";
import { useState } from "react";
import { InputImage } from "@/assets/input";
import mainLoginImage from "@/assets/mainLoginImage.jpg";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import EyeToggle from "@/components/ui/EyeToggle";
import Input from "@/components/ui/Input";
import LinksToMe from "@/components/ui/LinksToMe";
import { PATHS } from "@/constants/paths";
import type { SigninForm } from "../types";
import { SigninPayloadSchema } from "@linkstome/shared";
import { validateSchema } from "@/shared/utils/validation";
import apiClient from "@/services/apiClient";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export default function LoginPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<SigninForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!name) return;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (isLoading) return;

    try {
      const dataToValidate = {
        email: form.email,
        password: form.password,
      };

      const { isValid, errors: validationErrors } = validateSchema(
        SigninPayloadSchema,
        dataToValidate,
      );

      if (!isValid) {
        setErrors(validationErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setIsLoading(true);

      const response = await apiClient.post("/auth/login", dataToValidate);
      const data = response.data;
      dispatch(
        setAuth({
          user: data.user,
          token: data.accessToken,
        }),
      );
      setErrors({});
      setForm({
        email: "",
        password: "",
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
      <main className="flex flex-col flex-1 overflow-y-auto lg:overflow-hidden">
        <section className="flex-1 flex flex-col lg:flex-row">
          <aside className="hidden lg:flex lg:w-1/1 flex-col bg-white">
            <LinksToMe />

            <div className="flex-1 flex items-center justify-center p-6">
              <img
                src={mainLoginImage}
                alt="Login Image"
                loading="lazy"
                className="
                w-full
                max-w-xs  
                sm:max-w-sm
                md:max-w-md
                lg:max-w-lg
                xl:max-w-xl
                h-auto
                object-contain
                no-select
              "
              />
            </div>
          </aside>
          
          <section className="w-full lg:w-7/13  flex flex-col bg-white">
            <LinksToMe
              className="p-6 lg:hidden flex justify-center text-white bg-black"
              showBg={true}
            />
            <div className="p-6 flex items-center h-full justify-center lg:border-l-2 lg:border-gray-500">
              <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-6">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black">
                    Welcome back
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-gray-500">
                    Login to your account
                  </p>
                </div>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.email}
                  </p>
                )}

                <div className="relative">
                  <Input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <EyeToggle
                    icon={
                      showPassword ? InputImage.eyeOpen : InputImage.eyeClose
                    }
                    alt={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.password}
                  </p>
                )}

                <div className="flex justify-end">
                  <Link
                    to={PATHS.FORGOTPASSWORD}
                    className="text-sm text-black hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  variant="primary"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Login account..." : "Login"}
                </Button>

                <Button variant="secondary">
                  <img
                    src={InputImage.googleImg}
                    alt="Google"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  Continue with Google
                </Button>

                <Button
                  variant="primaryShort"
                  onClick={() => navigate(PATHS.SIGNUP)}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </section>
        </section>
        <footer className="h-18 flex items-center justify-center text-center bg-black text-white lg:border-t lg:border-gray-500">
          Our Terms And Conditions
        </footer>
      </main>
    </div>
  );
}
