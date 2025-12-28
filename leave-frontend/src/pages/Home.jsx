import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = () => {
    const { name, email, message } = form;

    // Validation
    if (!name || !email || !message) {
      Swal.fire("Validation Error", "All fields are required", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire("Validation Error", "Invalid email address", "error");
      return;
    }

    Swal.fire(
      "Message Sent",
      "Thank you for contacting us!",
      "success"
    );

    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">
          Leave<span className="text-blue-600">MS</span>
        </h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
          Smart Leave Management System
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-8">
          Manage employee leaves efficiently with role-based access,
          real-time approvals, and secure authentication.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-10 pb-20">
        {[
          {
            title: "Role Based Access",
            desc: "Separate dashboards for HR and Employees.",
          },
          {
            title: "Leave Approval Workflow",
            desc: "HR can approve or reject leave requests.",
          },
          {
            title: "Secure Authentication",
            desc: "JWT based login & protected routes.",
          },
        ].map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 px-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Contact Us
          </h3>

          <div className="grid gap-4">
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <Input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <Textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <Button onClick={handleSubmit} className="w-full">
              Send Message
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500">
        © {new Date().getFullYear()} LeaveMS. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
