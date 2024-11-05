import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditRecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    instructions: '',
    vegetarien: false,
    categorie: '',
    image: null,
    ingredients: []
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/recettes/${id}/`);
      const recipe = response.data;
      setFormData({
        ...recipe,
        image: recipe.image || null
      });
      setPreviewImage(recipe.image);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors de la récupération de la recette");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/recettes/${id}/`, formData);
      navigate('/recipes');
    } catch (error) {
      setError("Erreur lors de la mise à jour de la recette");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen pt-24">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FaArrowLeft /> Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Modifier la recette</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de la recette */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nom de la recette
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
              required
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="5"
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Catégorie
            </label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="entree">Entrée</option>
              <option value="plat">Plat principal</option>
              <option value="dessert">Dessert</option>
            </select>
          </div>

          {/* Option végétarien */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="vegetarien"
              checked={formData.vegetarien}
              onChange={handleChange}
              className="w-4 h-4 text-primary"
            />
            <label className="text-gray-700">
              Recette végétarienne
            </label>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Aperçu"
                  className="max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md"
            >
              <FaSave />
              Enregistrer
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeForm;