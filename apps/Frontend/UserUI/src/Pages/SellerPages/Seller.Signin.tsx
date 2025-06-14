import { useEffect, useState } from "react";
import { backend_url } from "../../../config";
import { background, logo } from "../../ImagesCollection";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getValidToken } from "@/Utiles/ValidateToken";

export function SellerSignin() {
  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem("authorization");

    async function fetchdata(){
      const {token ,isVerified} = await getValidToken();

      console.log("token", token)
      
      if (token && isVerified) {
        navigate("/seller/dashboard"); // Redirect if token exists
      }
      else if(token && !isVerified){
        navigate("/seller/pending-verification")
      }
    }

    fetchdata();
  }, []);

  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent page reload

    // Frontend validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("All fields are required! Please fill out the entire form.");
      return;
    }

    // Phone number validation (exactly 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // Password validation (optional, but good to have)
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      setloading(true); // Show loading state

      const response = await axios.post(
        `${backend_url}seller/register`, // Correct API endpoint
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ Enables cookies to be stored
        }
      );

      if (response.status === 200) {
        localStorage.setItem("authorization", response.data.sellerToken); // Save token

        const {token} = await getValidToken();

        console.log("token", token)

        if (response.data.isVerfied) {
          navigate("/seller/dashboard");
        } else {
          alert("Account under review. Redirecting to verification page.");
          navigate("/seller/pending-verification"); // 👈 custom pending page
        }

        // alert("Registration successful!");
        // navigate("/seller/dashboard");
      } else {
        alert("Failed to register. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Show validation errors if backend returns them
        alert(error.response.data.errors.map((err: any) => err.msg).join("\n"));
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setloading(false); // Hide loading state
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }} // Replace with your image path
    >
      {/* Card Container */}
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center -mt-12">
          <div className="flex items-center justify-center w-24 h-24">
            <img src={logo} alt="Logo" className="w-18 pt-8" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mt-4">
          Welcome to Mynstars
        </h2>
        <p className="text-gray-500 text-[0.8rem] font-medium">
          Let’s create your Partner Account to start your journey with us.
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className={`w-full bg-[#FF3F6C] text-white py-2 rounded-lg hover:bg-[#ff3f6ce3]  transition cursor-pointer ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? "Please wait" : "Register"}
          </button>

          <h1>
            Already have an account?{" "}
            <a href="/SellerLogin" className="text-[#FF3F6C] font-medium">
              Login
            </a>
          </h1>
        </form>
      </div>
    </div>
  );
}
