// src/features/auth/hooks/useLogin.ts
import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { loginApi } from "../api/login.api";
import { setAuth, setLoading } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      dispatch(setLoading(true));

      const res = await loginApi({ email, password });

      dispatch(setAuth(res));
      navigate("/", { replace: true });
    } catch (error) {
      alert((error as Error).message);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
