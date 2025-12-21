import { useState } from "react";
import BookingCard from "./_components/BookingCard";
import TicketInfo from "./_components/TicketInfo";
import PackageTable from "./_components/PackageTable";
import Tabs from "./_components/Tabs";
import ActionButton from "@/components/ActionButton";

export default function TicketDetailPage() {
  const [activeTab, setActiveTab] = useState("highlights");

  return (
    <div className="mx-auto  space-y-6">
      {/* Back */}
      <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← Back
      </button>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden shadow">
        <img
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe"
          alt="Ticket cover"
          className="w-full h-[360px] object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TicketInfo />
        <BookingCard />
      </div>

      {/* Package Table */}
      <PackageTable />

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <ActionButton label="Rate Sheet (PDF)" />
        <ActionButton label="Marketing Collateral" />
        <ActionButton label="Terms & Conditions" />
      </div>
    </div>
  );
}
