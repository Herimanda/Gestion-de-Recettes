import React from 'react';
import { X, Flame, Dumbbell, Apple, Droplets, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const EditIngredientForm = ({
  ingredientForm,
  handleInputChange,
  handleEditIngredient,
  setShowEditIngredientPopup,
  recettes
}) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Modifier l'ingrédient
            </h3>
            <p className="text-gray-500 mt-1">Modifiez les informations de l'ingrédient</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEditIngredientPopup(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </motion.button>
        </div>

        <form onSubmit={handleEditIngredient} className="space-y-6">
          {/* Section Informations de base */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Informations de base</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'ingrédient
                </label>
                <input
                  type="text"
                  name="nom"
                  value={ingredientForm.nom}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              <div className="flex gap-2 w-2/5">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    name="quantite"
                    value={ingredientForm.quantite}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité
                  </label>
                  <input
                    type="text"
                    name="unite"
                    value={ingredientForm.unite}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recette associée
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <Utensils className="text-gray-400" size={16} />
                </div>
                <select
                  name="recette_id"
                  value={ingredientForm.recette_id}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  <option value="">Sélectionner une recette</option>
                  {recettes && recettes.map(recette => (
                    <option key={recette._id} value={recette._id}>{recette.nom}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section Valeurs nutritionnelles */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Valeurs nutritionnelles</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Flame className="text-orange-400" size={16} />
                    Calories
                  </div>
                </label>
                <input
                  type="number"
                  name="calories"
                  value={ingredientForm.calories}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Dumbbell className="text-green-400" size={16} />
                    Protéines
                  </div>
                </label>
                <input
                  type="number"
                  name="proteines"
                  value={ingredientForm.proteines}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Apple className="text-purple-400" size={16} />
                    Glucides
                  </div>
                </label>
                <input
                  type="number"
                  name="glucides"
                  value={ingredientForm.glucides}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Droplets className="text-blue-400" size={16} />
                    Lipides
                  </div>
                </label>
                <input
                  type="number"
                  name="lipides"
                  value={ingredientForm.lipides}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditIngredientPopup(false)}
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Annuler
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Enregistrer les modifications
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditIngredientForm;