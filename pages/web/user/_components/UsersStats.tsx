import * as Icons from "lucide-react";


type Props = {
  userStats:{
    userCount:number,
    activeCount:number,
    adminCount:number
  }
}

export default function UsersStats({userStats}:Props) {


  const STATS = [
    { label: "Total Users", value: userStats.userCount, icon: Icons.Users, color: "bg-purple-100 text-purple-600" },
    { label: "Active Users", value: userStats.activeCount, icon: Icons.CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Admins", value: userStats.adminCount, icon: Icons.Shield, color: "bg-blue-100 text-blue-600" },
    // { label: "Can Book", value: 0, icon: Icons.UserCheck, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {STATS.map((s, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex gap-4">
          <div className={`${s.color} p-3 rounded-xl`}><s.icon size={24}/></div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{s.label}</p>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
