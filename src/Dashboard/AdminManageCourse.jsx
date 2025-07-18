import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageCourse.css';

function AdminManageCourses() {
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    learningContent: '', // ✅ Added field
    price: '',
    image: '',
    video: '',
    duration: '',
    level: '',
    instructor: '',
    modules: [
      {
        name: '',
        videos: [{ title: '', video: '', description: '' }]
      }
    ]
  });

  useEffect(() => {
    fetch('https://tb-back.onrender.com/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailedDescription: '',
      learningContent: '', // ✅ Reset field
      price: '',
      image: '',
      video: '',
      duration: '',
      level: '',
      instructor: '',
      modules: [
        {
          name: '',
          videos: [{ title: '', video: '', description: '' }]
        }
      ]
    });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    await fetch(`https://tb-back.onrender.com/api/courses/${id}`, { method: 'DELETE' });
    setCourses(courses.filter(c => c._id !== id));
  };

  const handleAdd = async () => {
    if (formData.price === '' || isNaN(Number(formData.price))) {
      alert('Please enter a valid price.');
      return;
    }

    const newForm = {
      ...formData,
      price: Number(formData.price),
    };

    const res = await fetch('https://tb-back.onrender.com/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newForm),
    });

    const newCourse = await res.json();
    setCourses([...courses, newCourse]);
    resetForm();
  };

  const handleEdit = (course) => {
    setFormData({
      ...course,
      price: course.price.toString()
    });
    setEditId(course._id);
  };

  const handleUpdate = async () => {
    if (formData.price === '' || isNaN(Number(formData.price))) {
      alert('Please enter a valid price.');
      return;
    }

    const { _id, ...rest } = formData;
    const dataToSend = {
      ...rest,
      price: Number(rest.price)
    };

    const res = await fetch(`https://tb-back.onrender.com/api/courses/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      const updated = await res.json();
      setCourses(courses.map(c => c._id === editId ? updated : c));
      resetForm();
    } else {
      alert('Failed to update course');
    }
  };

  const handleModuleNameChange = (value, index) => {
    const updated = [...formData.modules];
    updated[index].name = value;
    setFormData({ ...formData, modules: updated });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, {
        name: '',
        videos: [{ title: '', video: '', description: '' }]
      }]
    });
  };

  const removeModule = (index) => {
    const updated = [...formData.modules];
    updated.splice(index, 1);
    setFormData({ ...formData, modules: updated });
  };

  const handleVideoChange = (modIdx, vidIdx, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIdx].videos[vidIdx][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const addVideo = (modIdx) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIdx].videos.push({ title: '', video: '', description: '' });
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeVideo = (modIdx, vidIdx) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIdx].videos.splice(vidIdx, 1);
    setFormData({ ...formData, modules: updatedModules });
  };

  return (
    <div className="techborg-admin-course-page">
      <h2>Manage Courses</h2>

      <div className="techborg-course-form">
        <input type="text" placeholder="Title" value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

        <input type="text" placeholder="Short Description" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

        <textarea placeholder="Detailed Description" value={formData.detailedDescription}
          onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })} />

        {/* ✅ New Learning Content Field */}
        <textarea
          placeholder="Learning Content (text or HTML)"
          value={formData.learningContent}
          className="techborg-course-textarea"
          rows="6"
          onChange={(e) => setFormData({ ...formData, learningContent: e.target.value })}
        />

        <input
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val) || val === '') {
              setFormData({ ...formData, price: val });
            }
          }}
        />

        <input type="text" placeholder="Image URL" value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })} />

        <input type="text" placeholder="Course Video URL" value={formData.video}
          onChange={(e) => setFormData({ ...formData, video: e.target.value })} />

        <input type="text" placeholder="Duration" value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />

        <input type="text" placeholder="Level" value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })} />

        <input type="text" placeholder="Instructor" value={formData.instructor}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />

        <div className="section-group">
          <h4>Modules & Videos</h4>
          {formData.modules.map((mod, idx) => (
            <div key={idx} className="module-group">
              <div className="flex-between">
                <input
                  type="text"
                  placeholder={`Module ${idx + 1} Name`}
                  value={mod.name}
                  onChange={(e) => handleModuleNameChange(e.target.value, idx)}
                />
                {formData.modules.length > 1 && (
                  <button className="remove-btn" onClick={() => removeModule(idx)}>Remove Module</button>
                )}
              </div>

              <div className="section-group nested">
                <h5>Videos for {mod.name || `Module ${idx + 1}`}</h5>
                {mod.videos.map((vid, vidx) => (
                  <div className="video-group" key={vidx}>
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={vid.title}
                      onChange={(e) => handleVideoChange(idx, vidx, 'title', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={vid.video}
                      onChange={(e) => handleVideoChange(idx, vidx, 'video', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Video Description"
                      value={vid.description}
                      onChange={(e) => handleVideoChange(idx, vidx, 'description', e.target.value)}
                    />
                    {mod.videos.length > 1 && (
                      <button className="remove-btn" onClick={() => removeVideo(idx, vidx)}>Remove Video</button>
                    )}
                  </div>
                ))}
                <button onClick={() => addVideo(idx)} className="add-btn">+ Add Video</button>
              </div>
            </div>
          ))}
          <button onClick={addModule} className="add-btn">+ Add Module</button>
        </div>

        {editId ? (
          <button className="submit-btn" onClick={handleUpdate}>Update Course</button>
        ) : (
          <button className="submit-btn" onClick={handleAdd}>Add Course</button>
        )}
      </div>

      <div className="techborg-admin-course-grid">
        {courses.map((course) => (
          <div className="techborg-admin-course-card" key={course._id}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>₹{Number(course.price).toFixed(2)}</p>
            <button
              style={{ backgroundColor: '#4a7abe', marginBottom: '8px' }}
              onClick={() => handleEdit(course)}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(course._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageCourses;
