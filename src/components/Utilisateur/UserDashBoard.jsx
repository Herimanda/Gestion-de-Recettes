import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';

const UserDashBoard = () => {
  const [user, setUser] = useState({
    id: null,
    username: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get('http://localhost:8000/api/utilisateurs/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const currentUser = response.data.find(u => u.username === localStorage.getItem('username'));

      if (currentUser) {
        setUser({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
        });
      } else {
        throw new Error('Current user not found');
      }
    } catch (err) {
      setError('Failed to fetch user data: ' + err.message);
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const userData = {
        username: user.username,
        email: user.email,
        ...(password && { password: password })
      };

      const response = await axios.put(
        `http://localhost:8000/api/utilisateurs/${user.id}/`, 
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('User updated successfully:', response.data);
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      fetchUserData();
    } catch (err) {
      setError('Failed to update user data: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {isEditing ? (
            <>
              <BsArrowLeft
                className="mr-2 cursor-pointer hover:text-gray-600"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
              />
              Modifier Profil
            </>
          ) : (
            <>
              <FaUserEdit className="mr-2" />
              Informations de l'Utilisateur
            </>
          )}
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe (optionnel)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                disabled={!password}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Mettre à jour
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Modifier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashBoard;