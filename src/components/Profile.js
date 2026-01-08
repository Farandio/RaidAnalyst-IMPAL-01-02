import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    id: null,
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      fetch(`http://localhost:5000/api/user/${storedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile({
            id: data.id,
            fullName: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            bio: data.bio || "",
            avatar: data.avatar || null,
          });
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile({ ...profile, avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      setProfile({ ...profile, avatar: null });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profile.id,
          full_name: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
          avatar: profile.avatar,
        }),
      });
      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Failed to save changes");
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h2 className="profile-title">Account Settings</h2>

        <div className="photo-section">
          <div className="photo-wrapper">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" />
            ) : (
              <div className="placeholder">No Photo</div>
            )}
          </div>

          <div className="photo-btn-group">
            {/* Input file yang disembunyikan */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />

            {/* Tombol Change Photo */}
            <button
              type="button"
              className="photo-action-btn btn-change"
              onClick={() => fileInputRef.current.click()}
            >
              Change Photo
            </button>

            {/* Tombol Remove */}
            {profile.avatar && (
              <button
                type="button"
                className="photo-action-btn btn-remove"
                onClick={removePhoto}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              name="email"
              value={profile.email}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input name="phone" value={profile.phone} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          <button className="save-btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message && <p className="status-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Profile;
