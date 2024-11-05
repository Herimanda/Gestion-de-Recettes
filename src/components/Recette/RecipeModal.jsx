// RecipeModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const RecipeModal = ({ isOpen, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[50%] translate-y-[-50%] md:inset-auto md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:w-[90%] md:max-w-3xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header avec bouton de fermeture */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">{recipe.nom}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Image non disponible</span>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Catégorie</h3>
                    <p className="text-gray-600">{recipe.categorie}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Type</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      recipe.vegetarien 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {recipe.vegetarien ? 'Végétarien' : 'Non végétarien'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Description</h3>
                    <p className="text-gray-600">{recipe.description}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 whitespace-pre-line">{recipe.instructions}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeModal;