import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./Loading";
import {
  deletePostById,
  getAllUsers,
  editPostById,
} from "../services/user-service";
import {
  getAllPostsInHome,
  getAllPostsByUsername,
} from "../services/post-service";
import CreatePostModal from "./CreatePostModal";
import "./search-bar.css";

const ForEveryone = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    Promise.all([getAllPostsInHome(), getAllUsers()])
      .then(([postsResponse, usersResponse]) => {
        setPosts(postsResponse.data.content);
        setFilteredPosts(postsResponse.data.content);
        setUsers(usersResponse.data.content);
        setFilteredUsers(usersResponse.data.content);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los posts y los usuarios:", error);
        setIsLoading(false);
      });
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser) return;

    setIsFetchingPosts(true);
    setIsVerifyingToken(true);

    const timeout = setTimeout(() => {
      setIsVerifyingToken(false);
      setIsFetchingPosts(false);
      if (!currentUser) {
        return <Navigate to="/login" />;
      }
    }, 500); 

    getAllPostsByUsername(selectedUser)
      .then((response) => {
        setFilteredPosts(response.data.content);
        setIsFetchingPosts(false);
      })
      .catch((error) => {
        console.error("Error al obtener los posts del usuario:", error);
        setIsFetchingPosts(false);
      });

    return () => clearTimeout(timeout);
  }, [selectedUser, currentUser]);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
    }
  };

  const handleUserClick = (username) => {
    setSelectedUser(username);
  };

  const handleCloseCreatePostModal = () => {
    setShowCreatePostModal(false);
    setEditPostId(null); // Limpiar el ID del post que se está editando al cerrar el modal
  };

  const handleEditPost = (postId) => {
    setEditPostId(postId);
    setShowCreatePostModal(true);
  };

  const handleUpdatePost = (content) => {
    editPostById(storedUser.id, editPostId, { content }) // Utilizar el ID del post que se está editando
      .then(() => {
        setShowCreatePostModal(false);
        window.location.reload();
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
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error al eliminar la publicación:", error);
        });
    }
  };

  if (isLoading || isVerifyingToken || isFetchingPosts) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <div className="content">
          <h1>For everyone</h1>
          <ul>
            {filteredPosts.map((post) => (
              <li key={post.id}>
                {post.content}
                {currentUser &&
                  (currentUser.username === selectedUser ||
                    currentUser.username === post.username) && (
                    <div>
                      <button onClick={() => handleEditPost(post.id)}>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePost(storedUser.id, post.id)}
                      >
                        Borrar
                      </button>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
        <div className="sidebar">
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar usuarios..."
            />
          </div>
          <div>
            <h3>Usuarios</h3>
            <ul className="button-list">
              {filteredUsers.map((user) => (
                <li key={user.username} className="button-list-item">
                  <button
                    className="button-list-button"
                    onClick={() => handleUserClick(user.username)}
                  >
                    {user.username}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      {showCreatePostModal && (
        <CreatePostModal
          onCancel={handleCloseCreatePostModal}
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

export default ForEveryone;
