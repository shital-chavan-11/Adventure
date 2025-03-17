"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
        const response = await fetch("http://127.0.0.1:8000/trip/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

       
        // Store tokens in sessionStorage
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("userId", data.user.id); 

        console.log("User Role:", data.role);

        // Redirect based on user role
        if (data.role.toLowerCase() === "admin") {
            router.push("/admin_dashboard");
        } else {
            router.push("/dashboard");
        }
    } catch (err: any) {
        setError(err.message);
    }
    setLoading(false);
};

  
  

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Sign in to your account
              </h3>
              <p className="mb-11 text-center text-base font-medium text-body-color">
                Enter your credentials to access your account.
              </p>

              {error && <p className="text-red-600 text-center">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-3 block text-sm text-dark dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary"
                  />
                </div>

                <div className="mb-8">
                  <label className="mb-3 block text-sm text-dark dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
  <button
    type="submit"
    disabled={loading}
    className="w-full rounded-md bg-primary px-12 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-opacity-80"
  >
    Submit
  </button>
  <p className="text-center text-base font-medium text-body-color">
    New User?{" "}
    <Link href="/signup" className="text-primary hover:underline">
      Sign Up
    </Link>
  </p>
</div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
