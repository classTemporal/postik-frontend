import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./Loading";
import {
  getPostsById,
  createPost,
  editPostById,
  deletePostById,
} from "../services/user-service";
import CreatePostModal from "./CreatePostModal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./Profile.css";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedUsername = storedUser ? storedUser.username : null;
    setUsername(storedUsername);

    const userId = storedUser ? storedUser.id : null;

    if (userId) {
      getPostsById(userId)
        .then((response) => {
          if (response.data.hasOwnProperty("content")) {
            setPosts(response.data.content);
          } else {
            console.error(
              "La respuesta no contiene la propiedad 'content':",
              response.data
            );
          }
        })
        .catch((error) => {
          console.error("Error al obtener los posts:", error);
        });
    } else {
      console.error("ID de usuario no encontrado en el localStorage");
    }
  }, []);

  const handleOpenCreatePostModal = () => {
    setShowCreatePostModal(true);
    setEditPostId(null); // Limpiar el ID del post que se está editando al abrir el modal de creación
  };

  const handleCloseCreatePostModal = () => {
    setShowCreatePostModal(false);
    setEditPostId(null); // Limpiar el ID del post que se está editando al cerrar el modal
  };

  const handlePostCreatePost = (content) => {
    createPost(storedUser.id, { content })
      .then(() => {
        setSuccessMessage("Publicación creada con éxito");
        setShowCreatePostModal(false);
        updatePosts();
      })
      .catch((error) => {
        console.error("Error al crear el nuevo post:", error);
      });
  };

  const handleEditPost = (postId) => {
    setEditPostId(postId);
    setShowCreatePostModal(true);
  };

  const handleUpdatePost = (content) => {
    editPostById(storedUser.id, editPostId, { content }) // Utilizar el ID del post que se está editando
      .then(() => {
        setSuccessMessage("Publicación actualizada con éxito");
        setShowCreatePostModal(false);
        updatePosts();
      })
      .catch((error) => {
        console.error("Error al editar el post:", error);
      });
  };

  const handleDeletePost = (userId, postId) => {
    const confirmed = window.confirm(
      "¿Estás seguro que deseas eliminar la publicación?"
    );
    if (confirmed) {
      deletePostById(userId, postId)
        .then(() => {
          updatePosts();
          setSuccessMessage("Publicación eliminada con éxito");
        })
        .catch((error) => {
          console.error("Error al eliminar la publicación:", error);
        });
    }
  };

  const updatePosts = () => {
    getPostsById(storedUser.id)
      .then((response) => {
        if (response.data.hasOwnProperty("content")) {
          setPosts(response.data.content);
        } else {
          console.error(
            "La respuesta no contiene la propiedad 'content':",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error al obtener los posts después de crear uno nuevo:",
          error
        );
      });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="userpostscontainer">
      <header>
        <h3 className="userheader">
          <strong>
            Hello, <span className="stylePostik">{username}</span>.
          </strong>
        </h3>
        <div>
          <Button
            variant="primary"
            className="createbutton"
            onClick={handleOpenCreatePostModal}
          >
            New Postik
          </Button>
          <h4 className="yourpostiks">Your Postiks:</h4>
          <div className="postlist">
            <ul>
              {Array.isArray(posts) &&
                posts.map((post) => (
                  <li className="listp" key={post.id}>
                    <p>{post.content}</p>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-t" className="bi bi-three-dots-vertical"></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditPost(post.id)}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleDeletePost(storedUser.id, post.id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </header>
      {showCreatePostModal && (
        <CreatePostModal
          onCancel={handleCloseCreatePostModal}
          onPost={handlePostCreatePost}
          onUpdate={handleUpdatePost} // Pasar la función para actualizar post al modal
          initialContent={
            editPostId
              ? posts.find((post) => post.id === editPostId).content
              : ""
          } // Pasar el contenido inicial del post al modal
        />
      )}
    </div>
  );
};

export default Profile;
