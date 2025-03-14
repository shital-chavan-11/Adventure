"use client"; // If using Next.js 13+ with App Router

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/trip/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
        setTimeout(() => router.push("/signinpage"), 2000); // Redirect after 2 seconds
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setResendMessage("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/trip/resend-otp//", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage(data.message);
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Verify Your OTP
              </h3>
              <p className="mb-11 text-center text-base font-medium text-body-color">
                Enter the OTP sent to your email to verify your account.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-3 block text-sm text-dark dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary"
                  />
                </div>

                <div className="mb-8">
                  <label className="mb-3 block text-sm text-dark dark:text-white">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary"
                  />
                </div>

                {message && <p className="text-green-600 text-center">{message}</p>}
                {error && <p className="text-red-600 text-center">{error}</p>}
                {resendMessage && <p className="text-green-600 text-center">{resendMessage}</p>}

                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full rounded-sm bg-primary px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-opacity-80"
                  >
                    Verify OTP
                  </button>
                </div>
              </form>

              <p className="text-center text-base font-medium text-body-color">
                Didn't receive an OTP?{" "}
                <button
                  onClick={handleResendOTP}
                  className="text-primary hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPVerificationPage;
