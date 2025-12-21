import React from 'react';
import Header from '../../components/Header';

const Settings = () => {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <Header 
        title="Settings" 
        subtitle="Measure your advertising ROI and report website traffic."
      />

      <div className="space-y-8">
        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-50/50 px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Security</h3>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Password</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500">Last updated on 1 Jan 2021, 8:30:20 PM</span>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-50/50 px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="p-6 flex items-center justify-between">
             <div>
               <p className="font-medium text-gray-900 mb-1">Push Notifications</p>
               <p className="text-sm text-gray-500">Stay up-to-date with the latest news and updates from SDAX</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" value="" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
             </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
