'use client';

import React, { useEffect, useState } from 'react';
import { GiCow } from 'react-icons/gi';
import { ShoppingCart, Users } from 'lucide-react';
import StatutBarChart from './BarChart';
import dynamic from 'next/dynamic';
import axios from 'axios';
import TopBar from './TopBare';

const GrapheSexe = dynamic(() => import('./GrapheSexe'), { ssr: false });

const statuts = ['vendu', 'mort', 'abattu', 'nee'];

export default function AdminDashboardPage() {
  const [totalAnimaux, setTotalAnimaux] = useState(0);
  const [totalEmployes, setTotalEmployes] = useState(0);
  const [statutValue, setStatutValue] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/dashboard/stats/totalAnimaux', { withCredentials: true })
      .then((res) => setTotalAnimaux(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/dashboard/stats/totalEmployer', { withCredentials: true })
      .then((res) => setTotalEmployes(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/dashboard/statut-distribution', { withCredentials: true })
      .then((res) => setStatutValue(res.data))
      .catch((err) => console.error(err));
  }, []);
  
  const getStatutCount = (titre: string): number => {
    if (!Array.isArray(statutValue)) return 0;
    return statutValue.find((s: any) => s.statutTitre === titre)?.count || 0;
  };
   const nee = totalAnimaux-(getStatutCount('abattu')+getStatutCount('vendu')+getStatutCount('mort'));

  return (
    <main className=" space-y-8  ">
      <TopBar />
      <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <CardStat title="Total Animaux" value={totalAnimaux} icon={<GiCow size={24} />} />
        <CardStat title="Total Employés" value={totalEmployes} icon={<Users size={24} />} />
        <CardStat title="Naissances" value={nee} icon="🐄" />
        <CardStat title="Vendu" value={getStatutCount('vendu')} icon={<ShoppingCart size={24} />} bg="bg-yellow-50" />
      </div>

      {/* Graphiques mensuels */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📅 Répartition mensuelle par statut</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {statuts.map((statut) => (
            <StatutBarChart key={statut} statut={statut} />
          ))}
        </div>
      </section>
    </main>
  );
}

function CardStat({
  title,
  value,
  icon,
  bg = 'bg-white',
}: {
  title: string;
  value: number;
  icon: any;
  bg?: string;
}) {
  return (
    <div className={`${bg} p-4 rounded-xl shadow flex items-center space-x-4 hover:shadow-md transition`}>
      <div className="text-blue-600 text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
