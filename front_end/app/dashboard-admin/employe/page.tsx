import EmployeList from '@/composant/EmployeList';
import Sidebar from '@/composant/Sidebar';
import { Toaster } from 'react-hot-toast';
import { FaHome, FaSyringe, FaUsers, FaUsersCog } from "react-icons/fa";
import { GiCow } from "react-icons/gi";

const adminMenu = [
  { icon: <FaHome />, label: "Accueil", href: "/dashboard-admin" },
  { icon: <GiCow />, label: "Animaux", href: "/dashboard-admin/animal" },
  { icon: <FaSyringe />, label: "Vaccination", href: "/dashboard-admin/Vaccination" },
  { icon: <FaUsers />, label: "Employés", href: "/dashboard-admin/employe" },
  { icon: <FaUsersCog />, label: "Gestion des rôles", href: "/dashboard-admin/role" },
];


export default function DashboardPage() {
  return (
   <div className="flex min-h-screen bg-green-50">
             <Sidebar children={undefined} menuItems={adminMenu} />
<main className="flex-1 space-y-2 ml-64 p-1">
      <Toaster position="top-right" reverseOrder={false} />

               <EmployeList/>             
             </main>
           </div>
     );
   }