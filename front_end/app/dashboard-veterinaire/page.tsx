import AdminDashboardPage from '@/composant/AdminDashboardPage';
import Sidebar from '@/composant/Sidebar';
import {
  FaHome,
  FaSyringe,
  
} from "react-icons/fa";
import { GiCow } from "react-icons/gi";

const vetMenu = [
  { icon: <FaHome />, label: "Accueil", href: "/dashboard-veterinaire" },
  { icon: <GiCow />, label: "Animaux", href: "/dashboard-veterinaire/animal" },
  { icon: <FaSyringe />, label: "Vaccination", href: "/dashboard-veterinaire/Vaccination" },
];

export default function AdminDashboard() {
  return (
  <div className="flex min-h-screen bg-green-50">
          <Sidebar children={undefined} menuItems={vetMenu} />
          <main className="flex-1  ml-64 space-y-8 p-8 ">
           <AdminDashboardPage/>
          </main>
        </div>
  );
}
