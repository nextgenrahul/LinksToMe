// src/features/auth/pages/LoginPage.tsx
// import { Link } from "react-router-dom";
// import { useLogin } from "../hooks/useLogin";
// import { useSelector } from "react-redux";
// import { type RootState } from "@/store";
import "@/assets/css/logo.css";
export default function LoginPage() {
  // const { email, password, setEmail, setPassword, handleSubmit } = useLogin();

  // const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Main content */}
      <main className="h-[calc(100vh-4rem)]">
        <section className="w-full h-full flex flex-col lg:flex-row">
          {/* LEFT SIDE (Desktop only: Logo + Image) */}
          <aside className="hidden lg:flex lg:w-1/1 flex-col bg-[#0C1014]">
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
            <div className="flex-1 flex items-center justify-center">Image</div>
          </aside>

          {/* RIGHT SIDE (Form section – FULL HEIGHT) */}
          <section className="w-full lg:w-7/13 h-full flex flex-col bg-[#152127]">
            {/* Logo (MOBILE ONLY – TOP, NOT CENTER) */}
            <header className="p-6 lg:hidden bg-[#0C1014]">
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
            <div className="flex-1 p-6 flex items-center justify-center lg:border-l-2 lg:border-gray-600 ">
              Login Form
            </div>
          </section>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-18 flex items-center justify-center text-center bg-[#0C1014] lg:border-t lg:border-gray-600">
        Footer content goes here
      </footer>
    </div>
  );
}
