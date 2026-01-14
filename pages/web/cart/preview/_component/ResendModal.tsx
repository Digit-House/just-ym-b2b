import FormWapper from "@/components/FormWapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { resendEmail } from "@/graphql/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
  id: string;
};

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

const ResendModel = ({ open, onClose, email, id }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await resendEmail(data.email, id);
      if (res.data) {
        toast.success("Email Resent Successfully");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!open) return null;
  return (
    <>
      {/*@ts-ignore */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <div
          onClick={handleContentClick}
          className="bg-white w-full max-w-md rounded-xl shadow-xl text-center p-6 animate-slide-up transform transition-all"
        >
          {/* <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div> */}
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            Resend Email
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col gap-6 w-full">
                <FormWapper
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  dissabled={loading}
                />
                <div className="w-full flex gap-4">
                  <Button className="flex-1" type="submit">
                    {loading ? "Loading..." : "Resend"}
                  </Button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2  bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResendModel;
