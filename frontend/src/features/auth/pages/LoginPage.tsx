// src/features/auth/pages/LoginPage.tsx
// import { Link } from "react-router-dom";
// import { useLogin } from "../hooks/useLogin";
// import { useSelector } from "react-redux";
// import { type RootState } from "@/store";
import "@/assets/css/logo.css";
import { useState } from "react";
import { InputImage } from "@/assets/input";
import mainLoginImage from "@/assets/mainLoginImage.jpg";
export default function LoginPage() {
  // const { email, password, setEmail, setPassword, handleSubmit } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  // const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <main className="flex-1 h-screen">
        <section className="w-full h-full flex flex-col lg:flex-row">
          {/* LEFT SIDE (Desktop only: Logo + Image) */}
          <aside className="hidden lg:flex lg:w-1/1 flex-col bg-white">
            {/* Logo (DESKTOP ONLY) */}
            <header className="px-6 py-10">
              <div className="flex items-center h-16">
                <div className="keyboard">
                  <span className="key">L</span>
                  <span className="key">i</span>
                  <span className="key">n</span>
                  <span className="key">k</span>
                  <span className="key">s</span>
                  <span className="key">To</span>
                  <span className="key">M</span>
                  <span className="key">e</span>
                </div>
              </div>
            </header>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-6">
              <img
                src={mainLoginImage}
                alt="Login Image"
                className="
                w-full
                max-w-xs  
                sm:max-w-sm
                md:max-w-md
                lg:max-w-lg
                xl:max-w-xl
                h-auto
                object-contain
              
              "
              />
            </div>
          </aside>

          {/* RIGHT SIDE (Form section – FULL HEIGHT) */}
          <section className="w-full lg:w-7/13 min-h-screen flex flex-col bg-white">
            {/* Logo (MOBILE ONLY – TOP, NOT CENTER) */}
            <header className="p-6 lg:hidden flex justify-center text-white bg-black">
              <div className="flex items-center h-16">
                <div className="keyboard">
                  <span className="key">L</span>
                  <span className="key">i</span>
                  <span className="key">n</span>
                  <span className="key">k</span>
                  <span className="key">s</span>
                  <span className="key">To</span>
                  <span className="key">M</span>
                  <span className="key">e</span>
                </div>
              </div>
            </header>

            {/* Login Form (takes remaining height) */}
            <div className="flex-1 p-6 flex items-center justify-center lg:border-l-2 lg:border-gray-500">
              <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-6">
                {/* Heading */}
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black">
                    Welcome back
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-gray-500">
                    Login to your account
                  </p>
                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  className="
                    w-full
                    p-4 sm:p-5
                    text-base sm:text-[18px]
                    font-semibold
                    text-black
                    border-[1.5px] border-gray-500
                    rounded-lg
                    shadow-[2.5px_3px_0_#000]
                    outline-none
                    transition-shadow duration-250 ease-in-out
                    focus:shadow-[5.5px_7px_0_#000]
                  "
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="
                      w-full
                      p-4 sm:p-5
                      pr-12
                      text-base sm:text-[18px]
                      font-semibold
                      text-black
                      border-[1.5px] border-gray-500
                      rounded-lg
                      shadow-[2.5px_3px_0_#000]
                      outline-none
                      transition-shadow duration-250 ease-in-out
                      focus:shadow-[5.5px_7px_0_#000]
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <img
                      src={
                        showPassword ? InputImage.eyeOpen : InputImage.eyeClose
                      }
                      alt=""
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                  </button>
                </div>

                <button
                  type="button"
                  className="
                    w-full
                    flex items-center justify-center gap-3
                    p-3 sm:p-4
                    text-base sm:text-lg
                    font-semibold
                    text-white
                    bg-black
                    border-[1.5px] border-gray-500
                    rounded-lg
                    shadow-[2.5px_3px_0_#000]
                    transition-all duration-200
                    hover:translate-x-px hover:translate-y-px
                    hover:shadow-[1.5px_2px_0_#000]
                    active:translate-x-0.5 active:translate-y-0.5
                    active:shadow-none
                "
                >
                  Login
                </button>

                <button
                  type="button"
                  className="
                  mt-4
                    w-full
                    flex items-center justify-center gap-3
                    p-3 sm:p-4
                    text-base sm:text-lg
                    font-semibold
                    text-black
                    bg-white
                    border-[1.5px] border-gray-500
                    rounded-lg
                    shadow-[2.5px_3px_0_#000]
                    transition-all duration-200
                    hover:translate-x-px hover:translate-y-px
                    hover:shadow-[1.5px_2px_0_#000]
                    active:translate-x-0.5 active:translate-y-0.5
                    active:shadow-none
                  "
                >
                  <img
                    src={InputImage.googleImg}
                    alt="Google"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  Continue with Google
                </button>
                
                <button
                  type="button"
                  className="
                    w-full
                    flex items-center justify-center gap-3
                    p-2 sm:p-2
                    text-base sm:text-lg
                    font-semibold
                    text-white
                    bg-black
                    border-[1.5px] border-gray-500
                    rounded-lg
                    shadow-[2.5px_3px_0_#000]
                    transition-all duration-200
                    hover:translate-x-px hover:translate-y-px
                    hover:shadow-[1.5px_2px_0_#000]
                    active:translate-x-0.5 active:translate-y-0.5
                    active:shadow-none
                "
                >
                  Create Account
                </button>
              </div>
            </div>
          </section>
        </section>
     
    
      </main>

       {/* Footer */}
      <footer className="h-18 flex items-center justify-center text-center bg-black text-white lg:border-t lg:border-gray-500">
       Our Terms And Conditions
      </footer>
    </div>
  );
}
