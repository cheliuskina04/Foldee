import { useState } from 'react';

function CoverUploader({ setNewProject, setPreviewUrl }) {
    const [uploading, setUploading] = useState(false);
  
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      // Показати локальне прев’ю
      setPreviewUrl(URL.createObjectURL(file));
  
      // ... код завантаження на сервер ...
    };
  
    return (
      <div>
        <label>Обкладинка:</label>
        <input
          type="file"
          name="cover"
          accept="image/*"
          onChange={handleFileChange}
        />
        {uploading && <p>Завантаження...</p>}
      </div>
    );
  }

export default CoverUploader;
