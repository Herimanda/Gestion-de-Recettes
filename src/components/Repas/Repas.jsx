import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const Repas = () => {
  const [repas, setRepas] = useState([]);
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // État pour le formulaire avec des valeurs par défaut
  const [formData, setFormData] = useState({
    recette: '',
    date: new Date().toISOString().split('T')[0],
    type_repas: 'Petit-déjeuner'
  });

  // Fonction pour récupérer les repas
  const fetchRepas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/repas/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setRepas(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des repas:', err);
      setError(err.response?.data?.detail || 'Erreur lors de la récupération des repas');
      setLoading(false);
    }
  };

  // Fonction pour récupérer les recettes
  const fetchRecettes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/recettes/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setRecettes(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des recettes:', err);
      setError(err.response?.data?.detail || 'Erreur lors de la récupération des recettes');
    }
  };

  // Fonction pour ajouter un repas
  const ajouterRepas = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      if (!formData.recette) {
        setError('Veuillez sélectionner une recette');
        return;
      }
  
      const donnees = {
        recette_id: formData.recette,
        date: formData.date,
        type_repas: formData.type_repas
      };
  
      // Debug logs
      console.log('Données à envoyer:', {
        ...donnees,
        token: `Bearer ${localStorage.getItem('accessToken')}`.substring(0, 20) + '...',
      });
  
      const response = await axios.post(
        'http://localhost:8000/api/repas/',
        donnees,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Réponse du serveur:', response.data);
      
      await fetchRepas();
      setShowModal(false);
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Données de réponse:', err.response?.data);
      
      // Gestion détaillée des erreurs
      if (err.response?.data) {
        if (err.response.data.recette_id) {
          setError(`Erreur de recette: ${err.response.data.recette_id.join(', ')}`);
        } else if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          const errorMessages = Object.entries(err.response.data)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`;
              }
              return `${key}: ${value}`;
            })
            .join('\n');
          setError(errorMessages);
        }
      } else if (err.message) {
        setError(`Erreur: ${err.message}`);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };
  // Fonction pour supprimer un repas
// Dans Repas.jsx, modifiez la fonction supprimerRepas :
// Dans Repas.jsx, modifiez la fonction supprimerRepas :
const supprimerRepas = async (idRepas) => {
  try {
    console.log(`Tentative de suppression du repas avec ID: ${idRepas}`);
    
    const response = await axios.delete(`http://localhost:8000/api/repas/${idRepas}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    console.log('Suppression réussie:', response);
    await fetchRepas();
    setError(null);
    
  } catch (err) {
    console.error('Erreur détaillée:', err);
    console.error('Response data:', err.response?.data);
    
    const errorMessage = err.response?.data?.detail || 
                        err.response?.data?.message || 
                        'Erreur lors de la suppression du repas';
                        
    setError(errorMessage);
  }
};

  // Fonction pour gérer le changement de recette
  const handleRecetteChange = (e) => {
    const value = e.target.value;
    console.log('Recette sélectionnée:', value);
    setFormData(prev => ({
      ...prev,
      recette: value
    }));
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      recette: '',
      date: new Date().toISOString().split('T')[0],
      type_repas: 'Petit-déjeuner'
    });
  };

  useEffect(() => {
    fetchRepas();
    fetchRecettes();
  }, []);

  useEffect(() => {
    if (recettes.length > 0) {
      console.log('Recettes disponibles:', recettes.map(r => ({ 
        _id: r._id, 
        nom: r.nom 
      })));
    }
  }, [recettes]);

  const renderGrid = (typeRepas) => {
    const filteredRepas = repas.filter(r => r.type_repas === typeRepas);
    
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark2">{typeRepas}</h2>
          <button
            onClick={() => {
              setFormData({
                ...formData,
                type_repas: typeRepas,
                date: new Date().toISOString().split('T')[0]
              });
              setShowModal(true);
            }}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark"
          >
            <FaPlus />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredRepas.map((meal) => (
            <motion.div
              key={meal._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 shadow-md relative bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={meal.recette?.image || "/api/placeholder/100/100"}
                    alt={meal.recette?.nom}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{meal.recette?.nom}</h3>
                    <p className="text-sm text-dark2">{meal.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => supprimerRepas(meal._id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <section className="bg-white w-full min-h-screen pt-24 overflow-x-hidden font-poppins">
      <div className="w-full px-4 md:px-8 lg:px-16">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Gérez vos repas avec <span className="text-primary">Ma Cuisine</span>!
          </h1>
          <p className="text-lg text-dark2">
            Organisez vos repas quotidiens selon vos préférences.
          </p>
        </motion.div>

        {/* Three Grids Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderGrid('Petit-déjeuner')}
          {renderGrid('Déjeuner')}
          {renderGrid('Dîner')}
        </div>
      </div>

      {/* Modal pour ajouter un repas */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Ajouter un {formData.type_repas}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={ajouterRepas} className="space-y-6">
              {/* Sélection de la recette */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recette
                </label>
                <select
  value={formData.recette}
  onChange={handleRecetteChange}
  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
  required
>
  <option value="">Sélectionnez une recette</option>
  {recettes.map((recette) => (
    <option key={recette._id} value={recette._id}>
      {recette.nom}
    </option>
  ))}
</select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
                  readOnly
                />
              </div>

              {/* Type de repas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de repas
                </label>
                <input
                  type="text"
                  value={formData.type_repas}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Repas;