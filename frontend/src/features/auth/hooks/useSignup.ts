// src/features/auth/hooks/useSignup.ts
import { useState, type FormEvent } from "react";

export function useSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("SIGNUP", { name, email, password });
  }

  return {
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
