import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  fetchPost,
  deletePost,
  editPost,
} from "./features/post/PostSlice";

function App() {
  const [post, setPost] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPost());
  }, [dispatch]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedPost = { ...post, id: editId };
      dispatch(editPost(updatedPost));
      setIsEditing(false);
      setEditId(null);
    } else {
      dispatch(createPost(post));
    }
    setPost({});
  };

  const handleEdit = (post) => {
    setPost({ title: post.title, description: post.description });
    setIsEditing(true);
    setEditId(post.id);
  };

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Post Manager</h1>

      {/* Form Section */}
      <div className="d-flex justify-content-center mb-5">
        <div className="card w-50 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              {isEditing ? "Edit Post" : "Create Post"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={post.title || ""}
                  onChange={handleInput}
                  placeholder="Enter post title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  value={post.description || ""}
                  onChange={handleInput}
                  placeholder="Enter post description"
                />
              </div>
              <button
                type="submit"
                className={`btn ${isEditing ? "btn-warning" : "btn-primary"}`}
              >
                {isEditing ? "Update Post" : "Create Post"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Loading/Error Messages */}
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Posts Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Posts</h5>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(item)}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
