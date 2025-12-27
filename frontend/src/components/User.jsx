import { useForm } from "react-hook-form";
// import { useState } from "react";
import { Select } from "./ui/Select";
export const User = () => {
  const BACKEND = import.meta.env.VITE_BACKEND;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      category: "",
      issue: ""
    },
  });
  const onSubmit = async (data) => {
    try {
      const req = await fetch(`${BACKEND}/user/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await req.json();

      if (!req.ok) {
        console.log("Something's wrong I can feel it", req.error);
        return;
      }

      if(result.success) {
        reset()
        alert("Ticket has been submitted!")
      }
    } catch (error) {
      alert("Something's wrong", error);
    }
  };

  const category = [
    {
      id: 1,
      name: "Authentication",
    },
    {
      id: 2,
      name: "Payment Method",
    },
    {
      id: 3,
      name: "Technical Bug",
    },
    {
      id: 4,
      name: "Feature Request",
    },
    {
      id: 5,
      name: "UI/UX Feedback",
    },
    {
      id: 6,
      name: "Other",
    },
  ];

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="email@mail.com"
              className={`border-2 ${
                errors.email
                  ? "border-red-300 ring-red-50"
                  : "border-zinc-200 ring-zinc-100"
              } focus:ring-4 outline-none transition-all`}
            />
          </div>
          <div>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is required",
              })}
              placeholder="John Doe"
              className={`border-2 ${
                errors.name
                  ? "border-red-300 ring-red-50"
                  : "border-zinc-200 ring-zinc-100"
              } focus:ring-4 outline-none transition-all`}
            />
          </div>
          <div>
            <Select
              id="category"
              items={category}
              register={register("category", {
                required: "Category is required",
              })}
            />
          </div>
          {errors.category ? (
            <p className="text-red-500">You need to pick a category</p>
          ) : null}

          <div>
            <label htmlFor="issue">Tell us what happened</label>
            <textarea 
            id="issue"
            rows="4"
            cols="50"
            {...register("issue", {
              required: "Describe your issue"
            })}
            placeholder="Describe the issue in detail"
            className={`border-2 ${errors.issue ? "border-red-300" : "border-zinc-200"} focus-ring-4 outline-none transition-all`}
            ></textarea>
          </div>

          <div>
            <button>{isSubmitting ? "Submitting..." : "Submit"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
