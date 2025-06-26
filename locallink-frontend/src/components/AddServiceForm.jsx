import { useState, useEffect } from "react";

export default function AddServiceForm({ onCancel, onSubmit, onDelete, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPhotoPreview(initialData.photo || "");
    } else {
      setTitle("");
      setDescription("");
      setPhotoPreview("");
    }
    setPhoto(null);
  }, [initialData]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({ 
      id: initialData?._id, 
      title, 
      description, 
      photo: photo || initialData?.photo 
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Service" : "Add Service"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="3"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Photo</label>
          {photoPreview && (
            <img 
              src={photoPreview.startsWith('blob:') 
                ? photoPreview 
                : `http://localhost:5000${photoPreview}`}
              alt="Preview"
              className="w-full h-48 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
          
          {initialData && (
            <button
              type="button"
              onClick={() => onDelete(initialData._id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}