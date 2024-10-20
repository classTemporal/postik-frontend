import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const CreatePostModal = ({ onCancel, onPost, onUpdate, initialContent }) => {
  const [postContent, setPostContent] = useState(initialContent || "");

  useEffect(() => {
    setPostContent(initialContent || "");
  }, [initialContent]);

  const handlePost = () => {
    const confirmAction = initialContent ? "¿Seguro que quieres actualizar la publicación?" : "¿Seguro que quieres publicar?";
    const confirmPost = window.confirm(confirmAction);

    if (confirmPost) {
      if (initialContent) {
        onUpdate(postContent); // Llamar a la función para actualizar el post
      } else {
        onPost(postContent); // Llamar a la función para crear el nuevo post
      }

      setPostContent(""); // Limpiar el contenido del post después de publicar o actualizar
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <textarea
          id="postContent"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Escribe tu publicación aquí..."
        ></textarea>
        <div className="modal-buttons">
          <button onClick={handlePost}>{initialContent ? "Actualizar" : "Postear"}</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

CreatePostModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onPost: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  initialContent: PropTypes.string,
};

export default CreatePostModal;
