import EmployesAvecRole from '@/composant/EmployesAvecRole ';
import Sidebar from '@/composant/Sidebar';
import { ToastContainer } from 'react-toastify';
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
             <main className="flex-1 p-6 space-y-8 ml-60 p-1">
              <ToastContainer position="top-right" autoClose={3000} />
      
              <EmployesAvecRole/>
              </main>
           </div>
     );
   }