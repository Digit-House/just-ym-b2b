
import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Clock, 
} from 'lucide-react';
import { useUser } from "@/provider/UserProvider";
import PageContainer from "@/components/PageContainer";
import ModalWrapper from "@/components/ModalWrapper";
import ChangePasswordForm from "./_components/ChangePasswordForm";
import TwoFactorAuth from "./_components/TwoFactorAuth";


const Settings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const { user } = useUser();

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 text-sm">Manage your profile, roles, and security preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
        {/* Banner Area */}
        {/* <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="h-28 w-28 overflow-hidden rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0">
              {user.imageURI || user.profileData?.profilePicture ? (
                <img
                  src={user.imageURI || user.profileData?.profilePicture}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-indigo-50 flex items-center justify-center text-3xl font-bold text-indigo-600">
                  {getInitials(user.profileData?.firstName, user.profileData?.lastName)}
                </div>
              )}
            </div>
          </div>
        </div> */}

        <div className="pt-8 pb-8 px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-10">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user.profileData?.firstName} {user.profileData?.lastName}
                </h2>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide
                  ${user.active ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {user.active ? "ACTIVE ACCOUNT" : "INACTIVE"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User size={16} className="text-gray-400" />
                  <span>@{user.username}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={16} className="text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="group relative">
                  <span className="inline-flex items-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700">
                    <Shield size={14} className="mr-1.5" />
                    {user.type || "USER"}
                  </span>
                </div>
                {user.roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions for Profile */}
            {/* <div className="flex items-center gap-2">
              <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm">
                Edit Profile
              </button>
            </div> */}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-8 pt-8 border-t border-gray-100">
            
            <DetailItem 
              icon={<Phone size={18} className="text-indigo-500" />} 
              label="Contact Number" 
              value={`${user.countryCode ? `(${user.countryCode}) ` : ''}${user.contactNo || 'Not provided'}`} 
            />
            
            {/* <DetailItem 
              icon={<User size={18} className="text-indigo-500" />} 
              label="Gender" 
              value={user.profileData?.gender || 'Not provided'} 
            /> */}

            {/* <DetailItem 
              icon={<Calendar size={18} className="text-indigo-500" />} 
              label="Date of Birth" 
              value={user.profileData?.dateOfBirth ? new Date(user.profileData.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not provided'} 
            /> */}

            {/* <DetailItem 
              icon={<Globe size={18} className="text-indigo-500" />} 
              label="Nationality" 
              value={user.profileData?.nationality || 'Not provided'} 
            /> */}

            {/* <DetailItem 
              icon={<Clock size={18} className="text-indigo-500" />} 
              label="Member Since" 
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "---"} 
            /> */}

            <DetailItem 
              icon={<Clock size={18} className="text-indigo-500" />} 
              label="Last Login" 
              value={user.lastLogin ? new Date(user.lastLogin).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "Never"} 
            />

            <DetailItem 
              icon={<Clock size={18} className="text-indigo-500" />} 
              label="Last Updated" 
              value={user.updatedAt ? new Date(user.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "---"} 
            />
          </div>
        </div>
      </div>

      {/* --- SECURITY SECTION --- */}
      <div className="grid grid-cols-1  gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
          <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="text-indigo-600" size={20} />
              <h3 className="font-bold text-gray-900">Security & Privacy</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 italic">Highly Secure</span>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Password</p>
                <p className="text-sm text-gray-500">Change your password to maintain account safety.</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
                    Last updated on 1 Jan 2021
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
              >
                Change Password
              </button>
            </div>

            <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  {user.twoFactorEnabled 
                    ? "Two-factor authentication is currently enabled on your account." 
                    : "Add an extra layer of security to your account."}
                </p>
                {user.twoFactorEnabled && user.twoFactorConfirmedAt && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Shield size={12} className="text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      Enabled on {new Date(user.twoFactorConfirmedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setTwoFactorOpen(true)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${user.twoFactorEnabled
                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                {user.twoFactorEnabled ? "Disable 2FA" : "Setup 2FA"}
              </button>
            </div>
          </div>
        </div>

        {/* <div className="bg-indigo-600 hidden rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Need help?</h4>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Our support team is available 24/7 to assist you with any account or role-related queries.</p>
            <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
              Contact Support
            </button>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
        </div> */}
      </div>

      {open && (
        <ModalWrapper
          title="Account Security"
          onClose={() => setOpen(false)}
        >
          <ChangePasswordForm onClose={() => setOpen(false)} />
        </ModalWrapper>
      )}

      {twoFactorOpen && (
        <ModalWrapper
          title={user.twoFactorEnabled ? "Disable Two-Factor Authentication" : "Setup Two-Factor Authentication"}
          onClose={() => setTwoFactorOpen(false)}
          width="md"
        >
          <TwoFactorAuth onClose={() => setTwoFactorOpen(false)} />
        </ModalWrapper>
      )}
    </PageContainer>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="group space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
    </div>
    <div className="pl-6">
      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
        {value}
      </p>
    </div>
  </div>
);

export default Settings;
