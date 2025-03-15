"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000/trip/register/";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "user",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    gender: "",
    birth_date: "",
    password: "",
    confirm_password: "",
    profile_image: null,
    aadhaar_card: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataObj.append(key, value);
      }
    });
    formDataObj.append("role", formData.role);

    try {
      const response = await axios.post(BACKEND_URL, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data); // Log success response
      setMessage(response.data.message);
      setError("");
      router.push("/otp_verification");
    } catch (err) {
      console.error("Error Response:", err.response); // Log error response
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      setMessage("");
    }
  }

  return (
<section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[40px]" >
  <div className="container">
    <div className="-mx-4 flex flex-wrap">
      <div className="w-full px-4">
        <div className="shadow-three mx-auto max-w-[660px] rounded bg-white px-4 py-6 dark:bg-dark sm:p-8">
          <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Create an Account
          </h3>
          <p className="mb-6 text-center text-base font-medium text-body-color">
            Fill in the details to create your account.
          </p>
          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="mb-2 block text-sm text-dark dark:text-white">Select Role:</label>
              <select
                name="role"
                onChange={handleChange}
                required
                className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4 flex gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                required
                className="border-stroke w-1/2 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                required
                className="border-stroke w-1/2 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4 flex gap-4">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                onChange={handleChange}
                required
                className="border-stroke w-1/2 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              />
              <input
                type="date"
                name="birth_date"
                onChange={handleChange}
                required
                className="border-stroke w-1/2 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                required
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <select
                name="gender"
                onChange={handleChange}
                required
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4 flex gap-4">
  <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    required
    className="border-stroke w-1/2 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
  />
  <input
    type="password"
    name="confirm_password"
    placeholder="Confirm Password"
    onChange={handleChange}
    required
    className="border-stroke w-1/2 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
  />
</div>

            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label className="mb-2 block text-sm text-dark dark:text-white">Profile Image:</label>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="w-1/2">
                <label className="mb-2 block text-sm text-dark dark:text-white">Aadhaar Card:</label>
                <input
                  type="file"
                  name="aadhaar_card"
                  accept="application/pdf, image/*"
                  onChange={handleChange}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                 className="w-full rounded-md bg-primary px-12 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-opacity-80">
                Register
              </button>
            </div>
          </form>

          <p className="text-center text-base font-medium text-body-color">
            Already have an account?{" "}
            <Link href="/signinpage" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

  
  );
};


export default RegisterPage;