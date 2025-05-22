import AdminDashboardPage from '@/composant/AdminDashboardPage';
import Sidebar from '@/composant/Sidebar';
import {
  FaHome,
  FaSyringe,
  FaUsers,
  FaUsersCog,
  FaChartBar,
} from "react-icons/fa";
import { GiCow } from "react-icons/gi";

const adminMenu = [
  { icon: <FaHome />, label: "Accueil", href: "/dashboard-admin" },
  { icon: <GiCow />, label: "Animaux", href: "/dashboard-admin/animal" },
  { icon: <FaSyringe />, label: "Vaccination", href: "/dashboard-admin/Vaccination" },
  { icon: <FaUsers />, label: "Employés", href: "/dashboard-admin/employe" },
  { icon: <FaUsersCog />, label: "Gestion des rôles", href: "/dashboard-admin/role" },
];

export default function AdminDashboard() {
  return (
  <div className="flex min-h-screen bg-green-50">
          <Sidebar children={undefined} menuItems={adminMenu} />
          <main className="flex-1  ml-64 space-y-8 p-8">
          <AdminDashboardPage/>
          
          </main>
        </div>
  );
}
