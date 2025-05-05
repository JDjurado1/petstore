import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);

  // Fetch pets from backend
  useEffect(() => {
    axios.get('http://localhost:8080/jurado/pet')
      .then(response => setPets(response.data))
      .catch(() => setPets([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(val => val === '')) {
      alert('Please fill in all fields.');
      return;
    }

    if (isEditing) {
      // Edit existing pet
      axios.put(`http://localhost:8080/jurado/pet/${editingPetId}`, form)
        .then(response => {
          setPets(pets.map(pet => pet.id === editingPetId ? response.data : pet));
          resetForm();
        })
        .catch(() => alert('Failed to update pet.'));
    } else {
      // Add new pet
      axios.post('http://localhost:8080/jurado/pet', form)
        .then(response => {
          setPets(prev => [...prev, response.data]);
          resetForm();
        })
        .catch(() => alert('Failed to add pet.'));
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      species: '',
      breed: '',
      price: '',
      description: '',
      imageUrl: ''
    });
    setIsEditing(false);
    setEditingPetId(null);
  };

  const handleEdit = (pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      price: pet.price,
      description: pet.description,
      imageUrl: pet.imageUrl
    });
    setIsEditing(true);
    setEditingPetId(pet.id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/jurado/pet/${id}`)
      .then(() => {
        setPets(pets.filter(pet => pet.id !== id));
      })
      .catch(() => alert('Failed to delete pet.'));
  };

  return (
    <div className="app">
      <h1> Pet Store</h1>

      {/* Form for adding and editing pets */}
      <form onSubmit={handleSubmit} className="pet-form">
        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />

        <label>Species</label>
        <input type="text" name="species" value={form.species} onChange={handleChange} />

        <label>Breed</label>
        <input type="text" name="breed" value={form.breed} onChange={handleChange} />

        <label>Price</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange}></textarea>

        <label>Image URL</label>
        <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} />

        <button type="submit">{isEditing ? 'Update Pet' : 'Add Pet'}</button>
      </form>

      {/* Display pets */}
      {pets.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>No pets available.</p>
      ) : (
        <>
          <h2>Available Pets</h2>
          <div className="pet-list">
            {pets.map((pet, index) => (
              <div key={index} className="pet-card">
                <img src={pet.imageUrl} alt={pet.name} />
                <h3>{pet.name}</h3>
                <p><strong>Species:</strong> {pet.species}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Price:</strong> ₱{pet.price}</p>
                <p>{pet.description}</p>
                <button onClick={() => handleEdit(pet)}>Edit</button>
                <button onClick={() => handleDelete(pet.id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
