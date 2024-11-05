import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Salad, Apple, AlertCircle } from 'lucide-react';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estVegetarien, setEstVegetarien] = useState(false);
  const [objectifCalories, setObjectifCalories] = useState('');
  const [objectifProteines, setObjectifProteines] = useState('');
  const [objectifGlucides, setObjectifGlucides] = useState('');
  const [objectifLipides, setObjectifLipides] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
        preferences_alimentaires: {
          est_vegetarien: estVegetarien,
          objectif_calories: parseInt(objectifCalories),
          objectif_proteines: parseInt(objectifProteines),
          objectif_glucides: parseInt(objectifGlucides),
          objectif_lipides: parseInt(objectifLipides),
          allergies: allergies.map(allergie => ({ nom: allergie }))
        }
      });
      console.log('User registered successfully:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllergieChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setAllergies([...allergies, value]);
    } else {
      setAllergies(allergies.filter(allergie => allergie !== value));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 120
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl w-full"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Créez votre compte</h1>
              <p className="text-gray-600">Commencez votre voyage vers une alimentation équilibrée</p>
            </div>
          </div>
          
          <div className="px-6 pb-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Navigation buttons */}
              <div className="flex gap-4 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveSection('account')}
                  className={`py-3 px-4 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                    activeSection === 'account'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informations du compte
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('preferences')}
                  className={`py-3 px-4 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                    activeSection === 'preferences'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Préférences alimentaires
                </button>
              </div>

              {/* Account Section */}
              <div className={`space-y-6 ${activeSection === 'account' ? 'block' : 'hidden'}`}>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Adresse e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className={`space-y-6 ${activeSection === 'preferences' ? 'block' : 'hidden'}`}>
                <div className="space-y-6">
                  <div className="flex items-center bg-green-50 p-4 rounded-lg">
                    <Salad className="h-6 w-6 text-green-600 mr-3" />
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={estVegetarien}
                        onChange={(e) => setEstVegetarien(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded"
                      />
                      <span className="ml-2 text-gray-700">Régime végétarien</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Objectif calories quotidien
                      </label>
                      <input
                        type="number"
                        value={objectifCalories}
                        onChange={(e) => setObjectifCalories(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="kcal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Objectif protéines
                      </label>
                      <input
                        type="number"
                        value={objectifProteines}
                        onChange={(e) => setObjectifProteines(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="grammes"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Objectif glucides
                      </label>
                      <input
                        type="number"
                        value={objectifGlucides}
                        onChange={(e) => setObjectifGlucides(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="grammes"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Objectif lipides
                      </label>
                      <input
                        type="number"
                        value={objectifLipides}
                        onChange={(e) => setObjectifLipides(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="grammes"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700  items-center">
                      <Apple className="h-5 w-5 text-orange-500 mr-2" />
                      Allergies alimentaires
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['Lait', 'Œufs', 'Arachides', 'Noix', 'Soja', 'Blé', 'Poisson', 'Crustacés'].map((allergie) => (
                        <label key={allergie} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                          <input
                            type="checkbox"
                            value={allergie}
                            checked={allergies.includes(allergie)}
                            onChange={handleAllergieChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{allergie}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Retour
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;