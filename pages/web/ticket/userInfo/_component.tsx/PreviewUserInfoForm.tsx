import React, { useState } from "react";
import z from "zod";
import PreviewFormFrame from "./PreviewFormFrame";
import { ADD_TO_CART_USER_TYPE, CART_ICON_ENUM } from "@/types/product.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import FormWapper from "@/components/FormWapper";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  setCurrentOpen: React.Dispatch<React.SetStateAction<number>>;
  setUserInfoCheck: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<ADD_TO_CART_USER_TYPE | null>>;
};

const formSchema = z
  .object({
    sameAsLeader: z.boolean().optional(),
    name: z.string("Full name is required!").min(5, "Full name is required!"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    leaderName: z.string().optional(),
    leaderEmail: z.string().optional(),
    leaderPhone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.sameAsLeader) {
      if (!data.leaderName || data.leaderName.length < 5) {
        ctx.addIssue({
          path: ["leaderName"],
          message: "Group leader name is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.leaderEmail) {
        ctx.addIssue({
          path: ["leaderEmail"],
          message: "Group leader email is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

const PreviewUserInfoForm = ({
  setCurrentOpen,
  setUserInfoCheck,
  setUser,
}: Props) => {
  const [isEdit, setIsEdit] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      leaderName: "",
      leaderEmail: "",
      leaderPhone: "",
      sameAsLeader: false,
    },
  });

  const onSubmit = (data: any) => {
    setUser({
      name: data.name ? data.name : "",
      email: data.email,
      phone: data.phone ? data.phone : "",
      sameAsLeader: data.sameAsLeader ? data.sameAsLeader : false,
      leaderName: data.leaderName ? data.leaderName : "",
      leaderEmail: data.leaderEmail ? data.leaderEmail : "",
      leaderPhone: data.leaderPhone ? data.leaderPhone : "",
    });
    setUserInfoCheck(true);
    setIsEdit(false);
    setCurrentOpen(2);
  };
  return (
    <PreviewFormFrame
      title="Contact Information"
      iconName={CART_ICON_ENUM.USER}
      open={isEdit}
      setOpen={setIsEdit}
    >
      <div className="w-full px-8 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormWapper
                  name="name"
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  dissabled={!isEdit}
                  required
                />
                <FormWapper
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  dissabled={!isEdit}
                />
                <PhoneNumberInput
                  name="phone"
                  label="Phone Number"
                  disable={!isEdit}
                />
              </div>
              <FormField
                control={form.control}
                name="sameAsLeader"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);

                          if (checked) {
                            form.setValue("leaderName", "");
                            form.setValue("leaderEmail", "");
                            form.setValue("leaderPhone", "");
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Same as group leader information
                    </FormLabel>
                  </FormItem>
                )}
              />

              {!form.watch("sameAsLeader") && (
                <div>
                  <p className="mb-2 text-sm">Group leader information</p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormWapper
                      name="leaderName"
                      label="Full Name"
                      type="text"
                      placeholder="Enter group leader full name"
                      dissabled={!isEdit}
                      required
                    />

                    <FormWapper
                      name="leaderEmail"
                      label="Email"
                      type="email"
                      placeholder="Enter group leader email"
                      required
                      dissabled={!isEdit}
                    />

                    <FormWapper
                      name="leaderPhone"
                      label="Phone Number"
                      type="text"
                      placeholder="Enter group leader phone"
                      dissabled={!isEdit}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {/* <Button text="Confirm Information" type="submit" /> */}
                <Button type="submit" size="lg">
                  Confirm Information
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </PreviewFormFrame>
  );
};

export default PreviewUserInfoForm;
