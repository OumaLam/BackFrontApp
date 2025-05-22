'use client';
import Sidebar from "@/composant/Sidebar";

import { FaHome, FaSyringe, FaUsers, FaUsersCog } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import VaccinationConfirmation from "@/composant/non-vaccines";

const vetMenu = [
  { icon: <FaHome />, label: "Accueil", href: "/dashboard-veterinaire" },
  { icon: <GiCow />, label: "Animaux", href: "/dashboard-veterinaire/animal" },
  { icon: <FaSyringe />, label: "Vaccination", href: "/dashboard-veterinaire/Vaccination" },
];

export default function AnimalsPage() {
  return (
    <div className="flex min-h-screen bg-green-50">
          <Sidebar children={undefined} menuItems={vetMenu}/>
          <main className="flex-1 p-6 space-y-8 ml-64 p-6">
          <VaccinationConfirmation />
          
          </main>
        </div>
  );
}