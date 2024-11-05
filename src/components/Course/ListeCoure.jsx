import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  X, 
  Utensils, 
  Flame, 
  Dumbbell, 
  Apple, 
  Droplets,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import EditIngredientForm from './EditIngredientForm'; 

const ListeCourse = () => {
  const [ingredientsData, setIngredientsData] = useState({ ingredients: [], valeurs_nutritionnelles_totales: {} });
  const [recettes, setRecettes] = useState([]);
  const [error, setError] = useState(null);
  const [showAddIngredientPopup, setShowAddIngredientPopup] = useState(false);
  const [showEditIngredientPopup, setShowEditIngredientPopup] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  
  // État pour le formulaire d'édition
  const [ingredientForm, setIngredientForm] = useState({
    nom: '',
    quantite: '',
    unite: '',
    calories: '',
    proteines: '',
    glucides: '',
    lipides: '',
    recette_id: ''
  });

  // État pour le nouvel ingrédient
  const [newIngredient, setNewIngredient] = useState({
    nom: '',
    quantite: '',
    unite: '',
    calories: '',
    proteines: '',
    glucides: '',
    lipides: '',
    recette_id: ''
  });

  useEffect(() => {
    fetchIngredients();
    fetchRecettes();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ingredients/');
      setIngredientsData(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération des ingrédients:', error);
      setError(error?.response?.data || error.message);
    }
  };

  const fetchRecettes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/recettes/');
      setRecettes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setIngredientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    try {
      const ingredientData = {
        ...newIngredient,
        quantite: parseFloat(newIngredient.quantite),
        calories: parseFloat(newIngredient.calories),
        proteines: parseFloat(newIngredient.proteines),
        glucides: parseFloat(newIngredient.glucides),
        lipides: parseFloat(newIngredient.lipides),
      };

      if (!ingredientData.nom || !ingredientData.quantite || !ingredientData.unite) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }

      await axios.post('http://localhost:8000/api/ingredients/', ingredientData);
      fetchIngredients();
      setNewIngredient({
        nom: '',
        quantite: '',
        unite: '',
        calories: '',
        proteines: '',
        glucides: '',
        lipides: '',
        recette_id: ''
      });
      setShowAddIngredientPopup(false);
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      setError(error?.response?.data || error.message);
    }
  };

  const handleEditClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIngredientForm({
      nom: ingredient.nom,
      quantite: ingredient.quantite,
      unite: ingredient.unite,
      calories: ingredient.calories || '',
      proteines: ingredient.proteines || '',
      glucides: ingredient.glucides || '',
      lipides: ingredient.lipides || '',
      recette_id: ingredient.recette_id || ''
    });
    setShowEditIngredientPopup(true);
  };

  const handleEditIngredient = async (e) => {
    e.preventDefault();
    try {
      const ingredientData = {
        ...ingredientForm,
        unite: ingredientForm.unite || 'g', // Ajouter une unité par défaut si non spécifiée
        quantite: parseFloat(ingredientForm.quantite) || 0,
        calories: parseFloat(ingredientForm.calories) || 0,
        proteines: parseFloat(ingredientForm.proteines) || 0,
        glucides: parseFloat(ingredientForm.glucides) || 0,
        lipides: parseFloat(ingredientForm.lipides) || 0,
      };
      const response = await axios.put(
        `http://localhost:8000/api/ingredients/${selectedIngredient._id}/`, 
        ingredientData
      );
      await fetchIngredients();
      setShowEditIngredientPopup(false);
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      setError(error?.response?.data?.error || error.message);
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/ingredients/${ingredientId}/`);
        fetchIngredients();
      } catch (error) {
        setError(error?.response?.data || error.message);
      }
    }
  };



  

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-4 bg-red-100 rounded-lg m-4"
      >
        <AlertCircle className="text-red-500 mr-2" />
        <div className="text-red-500">Erreur: {JSON.stringify(error)}</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto pt-20 p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center mb-6 bg-white p-6 rounded-xl shadow-lg"
      >
        <ShoppingCart className="text-blue-600 mr-3" size={36} />
        <h2 className="text-3xl font-bold text-black">
          Liste de Courses et Valeurs Nutritionnelles
        </h2>
      </motion.div>

      {/* Tableau des ingrédients */}
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="bg-white rounded-xl shadow-xl p-6 mb-8 overflow-hidden"
      >
        <div className="flex items-center mb-4">
          <BookOpen className="text-blue-600 mr-2" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Liste des Ingrédients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                <th className="py-4 px-4 text-left">Nom de l'ingrédient</th>
                <th className="py-4 px-4 text-left">Quantité</th>
                <th className="py-4 px-4 text-left">Recette affiliée</th>
                <th className="py-4 px-4 text-left"><Flame size={18} className="inline mr-1 text-orange-500" /> Calories</th>
                <th className="py-4 px-4 text-left"><Dumbbell size={18} className="inline mr-1 text-green-500" /> Protéines</th>
                <th className="py-4 px-4 text-left"><Apple size={18} className="inline mr-1 text-purple-500" /> Glucides</th>
                <th className="py-4 px-4 text-left"><Droplets size={18} className="inline mr-1 text-blue-500" /> Lipides</th>
                <th className="py-4 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredientsData.ingredients.map((ingredient, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    transform hover:scale-[1.01] hover:bg-blue-50 transition-all duration-200
                  `}
                >
                  <td className="py-4 px-4 font-medium">{ingredient.nom}</td>
                  <td className="py-4 px-4">{ingredient.quantite} {ingredient.unite}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Utensils size={16} className="text-purple-500 mr-2" />
                      {ingredient.recette}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-orange-500 font-medium">{typeof ingredient.calories === 'number' ? ingredient.calories.toFixed(2) : ''}</td>
                  <td className="py-4 px-4 text-green-600 font-medium">{typeof ingredient.proteines === 'number' ? ingredient.proteines.toFixed(2) : ''}</td>
                  <td className="py-4 px-4 text-purple-600 font-medium">{typeof ingredient.glucides === 'number' ? ingredient.glucides.toFixed(2) : ''}</td>
                  <td className="py-4 px-4 text-blue-600 font-medium">{typeof ingredient.lipides === 'number' ? ingredient.lipides.toFixed(2) : ''}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(ingredient)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteIngredient(ingredient._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEditIngredientPopup && (
          <EditIngredientForm
            ingredientForm={ingredientForm}
            handleInputChange={(e) => setIngredientForm(prev => ({
              ...prev,
              [e.target.name]: e.target.value
            }))}
            handleEditIngredient={handleEditIngredient}
            setShowEditIngredientPopup={setShowEditIngredientPopup}
            recettes={recettes}
          />
        )}
      </AnimatePresence>


      {/* Valeurs nutritionnelles totales */}
      <motion.div
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        className="bg-white rounded-xl shadow-xl p-6 mb-8"
      >
        <div className="flex items-center mb-4">
          <CheckCircle2 className="text-green-500 mr-2" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Valeurs Nutritionnelles Totales</h3>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-medium">Calories</span>
              <Flame className="text-orange-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-orange-500">
              {typeof ingredientsData.valeurs_nutritionnelles_totales.calories === 'number'
                ? ingredientsData.valeurs_nutritionnelles_totales.calories.toFixed(2)
                : '0'} kcal
            </span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-medium">Protéines</span>
              <Dumbbell className="text-green-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-green-600">
              {typeof ingredientsData.valeurs_nutritionnelles_totales.proteines === 'number'
                ? ingredientsData.valeurs_nutritionnelles_totales.proteines.toFixed(2)
                : '0'} g
            </span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-medium">Glucides</span>
              <Apple className="text-purple-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-purple-600">
              {typeof ingredientsData.valeurs_nutritionnelles_totales.glucides === 'number'
                ? ingredientsData.valeurs_nutritionnelles_totales.glucides.toFixed(2)
                : '0'} g
            </span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-medium">Lipides</span>
              <Droplets className="text-blue-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-blue-600">
              {typeof ingredientsData.valeurs_nutritionnelles_totales.lipides === 'number'
                ? ingredientsData.valeurs_nutritionnelles_totales.lipides.toFixed(2)
                : '0'} g
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bouton d'ajout d'ingrédient */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl shadow-lg flex items-center transition-all duration-200"
          onClick={() => setShowAddIngredientPopup(true)}
        >
          <Plus className="mr-2" size={20} />
          Ajouter un ingrédient
        </motion.button>
      </div>

      {/* Pop-up pour le formulaire d'ajout d'ingrédient */}
      <AnimatePresence>
        {showAddIngredientPopup && (
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="bg-primary text-white text-2xl font-bold">
                  Ajouter un ingrédient
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddIngredientPopup(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              <form onSubmit={handleAddIngredient} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nom"
                    value={newIngredient.nom}
                    onChange={handleInputChange}
                    placeholder="Nom de l'ingrédient"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-gray-50"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="quantite"
                      value={newIngredient.quantite}
                      onChange={handleInputChange}
                      placeholder="Quantité"
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-2/3 bg-gray-50"
                    />
                    <input
                      type="text"
                      name="unite"
                      value={newIngredient.unite}
                      onChange={handleInputChange}
                      placeholder="Unité"
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-1/3 bg-gray-50"
                    />
                  </div>
                  </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Flame className="text-orange-400" size={16} />
                    </div>
                    <input
                      type="number"
                      name="calories"
                      value={newIngredient.calories}
                      onChange={handleInputChange}
                      placeholder="Calories"
                      className="pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full bg-gray-50"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Dumbbell className="text-green-400" size={16} />
                    </div>
                    <input
                      type="number"
                      name="proteines"
                      value={newIngredient.proteines}
                      onChange={handleInputChange}
                      placeholder="Protéines"
                      className="pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full bg-gray-50"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Apple className="text-purple-400" size={16} />
                    </div>
                    <input
                      type="number"
                      name="glucides"
                      value={newIngredient.glucides}
                      onChange={handleInputChange}
                      placeholder="Glucides"
                      className="pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full bg-gray-50"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Droplets className="text-blue-400" size={16} />
                    </div>
                    <input
                      type="number"
                      name="lipides"
                      value={newIngredient.lipides}
                      onChange={handleInputChange}
                      placeholder="Lipides"
                      className="pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-gray-50"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Utensils className="text-purple-400" size={16} />
                  </div>
                  <select
                    name="recette_id"
                    value={newIngredient.recette_id}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                  >
                    <option value="">Sélectionner une recette</option>
                    {recettes.map(recette => (
                      <option key={recette._id} value={recette._id}>{recette.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddIngredientPopup(false)}
                    className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <Plus className="mr-2" size={20} />
                      Ajouter
                    </div>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ListeCourse;