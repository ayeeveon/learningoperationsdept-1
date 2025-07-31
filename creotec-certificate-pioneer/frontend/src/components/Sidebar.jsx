import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-br from-[#6b55c7] to-[#4c3a91] text-white p-10 z-10">
      <h2 className="text-xl font-bold mb-10">Dashboard</h2>
      <nav className="flex flex-col space-y-4">

        <NavLink to="/home" className="block px-4 py-2 rounded hover:bg-purple-950 transition-colors">HOME</NavLink>
        <NavLink to="/generate" className="block px-2 py-2 rounded hover:bg-purple-950 transition-colors">Certificate Generator</NavLink>
        <NavLink to="/tesda" className="block px-4 py-2 rounded hover:bg-purple-950 transition-colors">TESDA</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
