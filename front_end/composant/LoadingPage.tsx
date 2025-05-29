import React, { useEffect, useState } from 'react';
import animationData from '../public/loading.json';

const LoadingPage = () => {
  const [Lottie, setLottie] = useState<any>(null);

  useEffect(() => {
    // Import dynamique uniquement côté client
    import('lottie-react').then((module) => {
      setLottie(() => module.default);
    });
  }, []);

  if (!Lottie) {
    // Afficher un loader simple ou rien le temps que Lottie se charge
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48">
          <Lottie animationData={animationData} loop={true} />
        </div>
        <p className="text-lg text-gray-600 font-medium">Chargement des données...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
