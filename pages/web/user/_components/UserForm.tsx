"use client"

import React,{ useState, useEffect } from "react"

export type UserFormValues = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

type UserFormProps = {
  initialValues?: Partial<UserFormValues>
  mode: "create" | "edit"
  onSubmit: (values: UserFormValues) => Promise<void>
  onCancel: () => void
}

export default function UserForm({
  initialValues,
  mode,
  onSubmit,
  onCancel
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setValues(prev => ({
        ...prev,
        ...initialValues,
      }))
    }
  }, [initialValues])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(values)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          className="w-full border rounded-md px-3 py-2"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          className="w-full border rounded-md px-3 py-2"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          className="w-full border rounded-md px-3 py-2"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          className="w-full border rounded-md px-3 py-2"
          name="phoneNumber"
          type="tel"
          value={values.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
        </button>
      </div>
    </form>
  )
}
