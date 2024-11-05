import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

// Composant Modal séparé pour les détails de la recette
const RecipeModal = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* En-tête du modal */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{recipe.nom}</h2>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            recipe.vegetarien 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {recipe.vegetarien ? 'Végétarien' : 'Non végétarien'}
          </span>
        </div>

        {/* Image de la recette */}
        {recipe.image && (
          <div className="mb-6">
            <img
              src={recipe.image}
              alt={recipe.nom}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-recipe.png';
              }}
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{recipe.description}</p>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="text-gray-600 whitespace-pre-line">{recipe.instructions}</p>
        </div>

        {/* Catégorie */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Catégorie</h3>
          <p className="text-gray-600 capitalize">{recipe.categorie}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal RecipeList
const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/recettes/');
      if (Array.isArray(response.data)) {
        const cleanedRecipes = response.data.map(recipe => ({
          ...recipe,
          image: recipe.image || null,
          description: recipe.description || 'Aucune description disponible'
        }));
        setRecipes(cleanedRecipes);
      } else {
        throw new Error('Format de données invalide');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des recettes:', err);
      setError('Impossible de charger les recettes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/recettes/${recipeId}/`);
        setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la recette');
      }
    }
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen relative pt-24">
      {/* En-tête avec titre */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Liste des <span className="text-primary">Recettes</span>
        </h1>
      </div>

      {/* Grille des recettes */}
      <AnimatePresence>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {recipes.map((recipe) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.nom}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-recipe.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Image non disponible</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {recipe.nom}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    recipe.vegetarien 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {recipe.vegetarien ? 'Végétarien' : 'Non végétarien'}
                  </span>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewRecipe(recipe)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Voir les détails"
                    >
                      <FaEye />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditRecipe(recipe._id)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      title="Modifier"
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bouton d'ajout fixe en bas à droite */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/add-recipe')}
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-40"
      >
        <FaPlus className="text-2xl" />
      </motion.button>

      {/* Modal des détails de la recette */}
      <AnimatePresence>
        {isModalOpen && (
          <RecipeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            recipe={selectedRecipe}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeList;