import Sidebar from '@/composant/Sidebar';
import AnimalDetails from '@/composant/AnimalDetails';
import { FaHome, FaSyringe } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
export default function DetailleAnimalPage( { params }: { params: { idAnimal: string }}) {
  
  const vetMenu = [
  { icon: <FaHome />, label: "Accueil", href: "/dashboard-veterinaire" },
  { icon: <GiCow />, label: "Animaux", href: "/dashboard-veterinaire/animal" },
  { icon: <FaSyringe />, label: "Vaccination", href: "/dashboard-veterinaire/Vaccination" },
];
  return (
    <div className="flex min-h-screen bg-green-50">
          <Sidebar children={undefined} menuItems={vetMenu} />
          <main className="flex-1  ml-64 space-y-8 ">
      <AnimalDetails  animalId={params.idAnimal}/>
          
          </main>
        </div>
  
  );
}
