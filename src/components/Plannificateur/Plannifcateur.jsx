import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1
  }
};

const RepasCard = ({ repasInfo }) => {
  if (!repasInfo) return (
    <div className="bg-gray-50 p-4 rounded-lg shadow min-h-[200px] flex items-center justify-center">
      <p className="text-gray-500 text-sm">Pas de repas planifié</p>
    </div>
  );

  const { nom, image } = repasInfo;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[200px]">
      <div className="relative h-32 w-full overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={nom}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/400/320';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Pas d'image disponible</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{nom}</h3>
      </div>
    </div>
  );
};

const Planificateur = () => {
  const [planRepas, setPlanRepas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Veuillez vous connecter pour accéder au planificateur');
          return;
        }

        const response = await fetch('http://localhost:8000/api/current-user/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          throw new Error('Impossible de récupérer les informations de l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setError('Erreur lors de la récupération de l\'utilisateur');
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const getNextWeekDates = () => {
      const today = new Date();
      const daysUntilMonday = (7 - today.getDay() + 1) % 7 || 7;

      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilMonday);

      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);

      setDateDebut(nextMonday.toISOString().split('T')[0]);
      setDateFin(nextSunday.toISOString().split('T')[0]);
    };

    getNextWeekDates();
  }, []);


  const handlePlanifierRepas = async () => {
    if (!currentUser) {
      setError('Veuillez vous connecter pour générer un plan de repas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Veuillez vous connecter pour générer un plan de repas');
        return;
      }

      const requestData = {
        utilisateur: currentUser.id,
        date_debut: dateDebut,
        date_fin: dateFin
      };

      const response = await fetch('http://localhost:8000/api/plan_repas/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setPlanRepas(data.repas_par_jour);

    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (debut, fin) => {
    const start = new Date(debut);
    const end = new Date(fin);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Les dates sélectionnées ne sont pas valides";
    }

    if (start > end) {
      return "La date de début doit être antérieure à la date de fin";
    }

    if ((end - start) / (1000 * 60 * 60 * 24) > 31) {
      return "La période ne peut pas dépasser 31 jours";
    }

    return null;
  };

  const getRepasForDate = (date) => {
    if (!planRepas || !planRepas[date]) {
      return {
        'petit_dejeuner': null,
        'dejeuner': null,
        'diner': null
      };
    }
    return planRepas[date];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Planificateur de Repas Intelligent
          </h1>
          
          {currentUser && (
            <p className="text-gray-600 mb-6">
              Planification pour: {currentUser.username}
            </p>
          )}

          <div className="flex justify-center gap-4 mb-6">
            <div className="flex flex-col">
              <label htmlFor="date-debut" className="text-sm text-gray-600 mb-1">
                Date de début
              </label>
              <input
                id="date-debut"
                type="date"
                value={dateDebut}
                onChange={(e) => {
                  setDateDebut(e.target.value);
                  setError(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="date-fin" className="text-sm text-gray-600 mb-1">
                Date de fin
              </label>
              <input
                id="date-fin"
                type="date"
                value={dateFin}
                onChange={(e) => {
                  setDateFin(e.target.value);
                  setError(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 max-w-md mx-auto">
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={() => {
              const dateError = validateDates(dateDebut, dateFin);
              if (dateError) {
                setError(dateError);
              } else {
                handlePlanifierRepas();
              }
            }}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full
                      shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération en cours...
              </span>
            ) : (
              'Générer un nouveau plan'
            )}
          </button>
        </motion.div>

        {planRepas && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-7 gap-4"
          >
            {getDatesInRange(dateDebut, dateFin).map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const repasJour = getRepasForDate(dateStr);
              return (
                <motion.div
                  key={dateStr}
                  variants={item}
                  className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-4"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                    {formatDate(date)}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">
                        Petit-déjeuner
                      </h4>
                      <RepasCard repasInfo={repasJour.petit_dejeuner} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">
                        Déjeuner
                      </h4>
                      <RepasCard repasInfo={repasJour.dejeuner} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">
                        Dîner
                      </h4>
                      <RepasCard repasInfo={repasJour.diner} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Planificateur;