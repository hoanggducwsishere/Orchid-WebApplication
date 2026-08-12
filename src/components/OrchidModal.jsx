import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

const OrchidSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  origin: Yup.string().required('Origin is required'),
  color: Yup.array().min(1, 'Select at least one color').required('Color is required'),
  rating: Yup.number().min(1, 'Min is 1').max(5, 'Max is 5').required('Rating is required'),
  img: Yup.string().required('Image URL is required'),
  videoUrl: Yup.string().required('Video URL is required'),
  description: Yup.string().required('Description is required')
});

const OrchidModal = ({ show, handleClose, handleSubmit, initialData }) => {
  const categoriesState = useSelector(state => state.categories?.data) || [];
  const categoryList = Array.isArray(categoriesState) ? categoriesState : [];
  
  const [colorDropdownOpen, setColorDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  const handleImageUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Without these the URL below becomes .../v1_1/undefined/image/upload, and
    // Cloudinary answers "cloud_name is disabled" — which reads like a suspended
    // account instead of a build that was missing its environment variables.
    if (!cloudName || !uploadPreset) {
      setUploadError('Image upload is not configured. The Cloudinary settings are missing from this build.');
      setIsUploading(false);
      e.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setFieldValue('img', data.secure_url);
      } else {
        setUploadError(data.error?.message || 'Upload failed. Please try again.');
      }
    } catch (error) {
      setUploadError('Error uploading image.');
    } finally {
      setIsUploading(false);
      // Xóa value của input file để có thể chọn lại cùng một file nếu muốn
      e.target.value = null;
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setColorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitialValues = () => {
    if (initialData) {
      return {
        name: initialData.name || '',
        category: initialData.category || '',
        origin: initialData.origin || '',
        color: initialData.color ? initialData.color.split('/') : [],
        rating: initialData.rating || 1,
        isSpecial: !!initialData.isSpecial,
        isNatural: !!initialData.isNatural,
        img: initialData.img || '',
        videoUrl: initialData.videoUrl || '',
        description: initialData.description || ''
      };
    }
    return {
      name: '',
      category: '',
      origin: '',
      color: [],
      rating: 1,
      isSpecial: false,
      isNatural: false,
      img: '',
      videoUrl: '',
      description: ''
    };
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Orchid Details' : 'Add New Orchid'}</Modal.Title>
      </Modal.Header>
      
      <Formik
        enableReinitialize
        initialValues={getInitialValues()}
        validationSchema={OrchidSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const submissionValues = {
            ...values,
            color: Array.isArray(values.color) ? values.color.join('/') : values.color
          };
          try {
            await handleSubmit(submissionValues);
          } finally {
            // The parent keeps the modal open when saving fails, so the button has
            // to become clickable again for the retry.
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="g-3">
                {/* Row 1: Name & Image */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Orchid Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      placeholder="e.g. Vanda Orchid"
                      value={values.name} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      isInvalid={touched.name && errors.name} 
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Orchid Image</Form.Label>
                    {!values.img ? (
                      <div>
                        <div 
                          className={`d-flex align-items-center gap-2 border rounded px-3 py-2 ${touched.img && errors.img ? 'border-danger' : ''}`} 
                          style={{ backgroundColor: '#f8f9fa' }}
                        >
                          <Button 
                            as="label" 
                            htmlFor="image-upload" 
                            variant="outline-secondary" 
                            size="sm"
                            className="mb-0"
                            disabled={isUploading}
                            style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
                          >
                            Choose File
                          </Button>
                          <span className="text-muted small text-truncate">
                            {isUploading ? 'Uploading image...' : 'No file chosen'}
                          </span>
                        </div>
                        <Form.Control 
                          id="image-upload"
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setFieldValue)} 
                          disabled={isUploading}
                          isInvalid={touched.img && errors.img}
                          className="d-none"
                        />
                        {uploadError && <div className="text-danger mt-1 small">{uploadError}</div>}
                        {touched.img && errors.img && (
                          <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{errors.img}</div>
                        )}
                      </div>
                    ) : (
                      <div className="position-relative d-inline-block border rounded p-1" style={{ borderColor: 'var(--border-color)', background: '#fff' }}>
                        <img 
                          src={values.img} 
                          alt="Preview" 
                          style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="position-absolute rounded-circle p-0" 
                          style={{ top: '-10px', right: '-10px', width: '24px', height: '24px', lineHeight: '1' }}
                          onClick={() => setFieldValue('img', '')}
                          title="Remove Image"
                        >
                          &times;
                        </Button>
                      </div>
                    )}
                  </Form.Group>
                </Col>

                {/* Row 2: Category, Origin & Rating */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={values.category}
                      onChange={(e) => {
                        handleChange(e);
                        const selectedCategoryName = e.target.value;
                        const categoryObj = categoryList.find(c => c.name === selectedCategoryName);
                        if (categoryObj && categoryObj.description) {
                          setFieldValue('description', categoryObj.description);
                        }
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.category && errors.category}
                    >
                      <option value="">Select a category</option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Origin</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="origin" 
                      placeholder="e.g. Southeast Asia, Brazil"
                      value={values.origin} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      isInvalid={touched.origin && errors.origin} 
                    />
                    <Form.Control.Feedback type="invalid">{errors.origin}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Rating (1.0 - 5.0)</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1" 
                      min="1" 
                      max="5" 
                      name="rating" 
                      placeholder="e.g. 4.5"
                      value={values.rating} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      isInvalid={touched.rating && errors.rating} 
                    />
                    <Form.Control.Feedback type="invalid">{errors.rating}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Row 3: Video URL & Status Options */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Video Embed URL</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="videoUrl" 
                      placeholder="e.g. https://www.youtube.com/embed/..."
                      value={values.videoUrl} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      isInvalid={touched.videoUrl && errors.videoUrl} 
                    />
                    <Form.Control.Feedback type="invalid">{errors.videoUrl}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="d-flex align-items-end">
                  <div className="d-flex gap-4 w-100 pb-2">
                    <Form.Group>
                      <Form.Check 
                        type="checkbox" 
                        name="isSpecial" 
                        id="isSpecialCheck"
                        label="Is Special / Rare?" 
                        checked={values.isSpecial} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Check 
                        type="checkbox" 
                        name="isNatural" 
                        id="isNaturalCheck"
                        label="Is Wild Natural?" 
                        checked={values.isNatural} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </div>
                </Col>

                 {/* Row 4: Colors Choice (Dropdown Multi-Select) */}
                <Col md={12}>
                  <Form.Group className="text-start">
                    <Form.Label>Orchid Colors</Form.Label>
                    <div className="color-select-container" ref={dropdownRef}>
                      <div 
                        className={`form-control color-select-trigger ${colorDropdownOpen ? 'is-open' : ''}`}
                        onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      >
                        <span className="text-truncate">
                          {values.color && values.color.length > 0 
                            ? values.color.join(', ') 
                            : '-- Select Colors --'}
                        </span>
                        <svg className="chevron-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      
                      {colorDropdownOpen && (
                        <div className="color-select-dropdown">
                          {['Pink', 'Purple', 'White', 'Yellow', 'Orange', 'Red', 'Blue', 'Green', 'Brown'].map((colorName) => (
                            <label key={colorName} className="color-checkbox-item">
                              <input
                                type="checkbox"
                                name="color"
                                value={colorName}
                                checked={values.color && values.color.includes(colorName)}
                                onChange={handleChange}
                                className="form-check-input"
                              />
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-h)' }}>{colorName}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {touched.color && errors.color && (
                      <div className="text-danger small mt-1 text-start" style={{ fontSize: '0.82rem' }}>
                        {Array.isArray(errors.color) ? errors.color[0] : errors.color}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                {/* Row 5: Description */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      name="description" 
                      placeholder="Write botanical description here..."
                      value={values.description} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      isInvalid={touched.description && errors.description} 
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" className="px-4 py-2 rounded-3" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="premium-action" className="px-4 py-2" type="submit" disabled={isUploading || isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : isUploading
                    ? 'Uploading...'
                    : (initialData ? 'Save Changes' : 'Create Orchid')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default OrchidModal;

