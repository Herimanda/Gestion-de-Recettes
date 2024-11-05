import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaHeart, FaLeaf, FaUtensils, FaAppleAlt, FaMoneyBillWave, FaArrowLeft, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const PreferenceCard = ({ icon, title, value, isEditing, onChange, type = "text", options = [], placeholder }) => {
  // Pour debugger les valeurs reçues
  console.log('PreferenceCard value:', value, 'type:', typeof value);
  
  // Fonction pour formater l'affichage des allergies
  const formatAllergies = (allergies) => {
    if (Array.isArray(allergies) && allergies.length > 0) {
      return allergies.join(', ');
    } else if (typeof allergies === 'string' && allergies.trim()) {
      return allergies;
    }
    return "Aucune allergie définie";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center gap-4 p-4 bg-white rounded-md shadow-sm"
    >
      {icon}
      <div className="w-full">
        <h3 className="text-xl font-bold">{title}</h3>
        {!isEditing ? (
          <p className="text-dark2">
            {title === "Allergies" 
              ? formatAllergies(value)
              : (value || `Aucun${type === "number" ? "e valeur" : "e"} défini${type === "number" ? "e" : ""}`)}
          </p>
        ) : (
          type === "select" ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )
        )}
      </div>
    </motion.div>
  );
};

const Preference = ({ goBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    est_vegetarien: false,
    allergies: [],
    objectif_calories: 0,
    objectif_proteines: 0,
    objectif_glucides: 0,
    objectif_lipides: 0,
  });
  const [originalPreferences, setOriginalPreferences] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/preferences/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // S'assurer que les allergies sont toujours un tableau
      const formattedData = {
        ...response.data,
        allergies: Array.isArray(response.data.allergies) 
          ? response.data.allergies 
          : response.data.allergies 
            ? response.data.allergies.split(',').map(a => a.trim())
            : []
      };
      
      setPreferences(formattedData);
      setOriginalPreferences(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
    }
  };

  const handleEditClick = () => {
    setOriginalPreferences({...preferences});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setPreferences({...originalPreferences});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setPreferences(prevPreferences => {
      if (field === 'allergies') {
        // Gérer les allergies comme un tableau
        const allergiesList = typeof value === 'string'
          ? value.split(',').map(a => a.trim()).filter(a => a !== '')
          : value;
        
        return {
          ...prevPreferences,
          allergies: allergiesList
        };
      }
      
      return {
        ...prevPreferences,
        [field]: field.includes('objectif_') ? parseFloat(value) || 0 : value,
      };
    });
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Préparer les données pour l'envoi
      const dataToSend = {
        ...preferences,
        // S'assurer que les allergies sont dans le bon format
        allergies: Array.isArray(preferences.allergies) 
          ? preferences.allergies 
          : typeof preferences.allergies === 'string'
            ? preferences.allergies.split(',').map(a => a.trim()).filter(a => a !== '')
            : []
      };
      
      console.log('Données envoyées:', dataToSend); // Pour le debug
      
      const response = await axios.put(
        'http://localhost:8000/api/preferences/',
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.status === 200) {
        const updatedData = {
          ...response.data,
          allergies: Array.isArray(response.data.allergies)
            ? response.data.allergies
            : response.data.allergies
              ? response.data.allergies.split(',').map(a => a.trim())
              : []
        };
        
        setPreferences(updatedData);
        setOriginalPreferences(updatedData);
        setIsEditing(false);
        alert('Préférences mises à jour avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      alert('Une erreur est survenue lors de la mise à jour des préférences.');
    }
  };

  return (
    <section className="bg-white w-full min-h-screen pt-24 overflow-x-hidden font-poppins">
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Personnalisez vos <span className="text-primary">Préférences Alimentaires</span>!
          </h1>
          <p className="text-lg text-dark2">
            Simplifiez votre plan de repas selon vos goûts et objectifs. Vos repas, vos règles!
          </p>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-light p-6 shadow-lg rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Vos Préférences</h2>
            <div className="flex gap-2">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark flex items-center gap-2"
                >
                  <FaEdit /> Modifier
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2"
                  >
                    Sauvegarder
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleCancelClick}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                  >
                    <FaTimes /> Annuler
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Display Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PreferenceCard
              icon={<FaLeaf className="text-4xl text-green-500" />}
              title="Est Végétarien"
              value={preferences.est_vegetarien ? 'Oui' : 'Non'}
              isEditing={isEditing}
              onChange={(value) => handleChange('est_vegetarien', value === 'Oui')}
              type="select"
              options={['Oui', 'Non']}
            />
            <PreferenceCard
              icon={<FaAppleAlt className="text-4xl text-red-500" />}
              title="Allergies"
              value={preferences.allergies}
              isEditing={isEditing}
              onChange={(value) => handleChange('allergies', value)}
              type="text"
              placeholder="Entrez les allergies séparées par des virgules"
            />
            <PreferenceCard
              icon={<FaUtensils className="text-4xl text-yellow-500" />}
              title="Objectif Calories"
              value={preferences.objectif_calories}
              isEditing={isEditing}
              onChange={(value) => handleChange('objectif_calories', value)}
              type="number"
            />
            <PreferenceCard
              icon={<FaMoneyBillWave className="text-4xl text-blue-500" />}
              title="Objectif Protéines"
              value={preferences.objectif_proteines}
              isEditing={isEditing}
              onChange={(value) => handleChange('objectif_proteines', value)}
              type="number"
            />
            <PreferenceCard
              icon={<FaMoneyBillWave className="text-4xl text-blue-500" />}
              title="Objectif Glucides"
              value={preferences.objectif_glucides}
              isEditing={isEditing}
              onChange={(value) => handleChange('objectif_glucides', value)}
              type="number"
            />
            <PreferenceCard
              icon={<FaMoneyBillWave className="text-4xl text-blue-500" />}
              title="Objectif Lipides"
              value={preferences.objectif_lipides}
              isEditing={isEditing}
              onChange={(value) => handleChange('objectif_lipides', value)}
              type="number"
            />
          </div>
        </motion.div>

        {/* Call-to-action Section */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-lg text-dark2 mb-4">
              Vos préférences personnalisées vous aident à atteindre vos objectifs santé tout en profitant de vos plats préférés.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSaveClick}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2 mx-auto"
            >
              <FaHeart /> Sauvegarder vos préférences
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Preference;