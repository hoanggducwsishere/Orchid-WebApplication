import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required')
});

const CategoryModal = ({ show, handleClose, handleSubmit, initialData }) => {
  const getInitialValues = () => {
    if (initialData) {
      return {
        name: initialData.name || '',
        description: initialData.description || ''
      };
    }
    return {
      name: '',
      description: ''
    };
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Category' : 'Add New Category'}</Modal.Title>
      </Modal.Header>
      
      <Formik
        enableReinitialize
        initialValues={getInitialValues()}
        validationSchema={CategorySchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await handleSubmit(values);
          } finally {
            // The parent keeps the modal open when saving fails, so the button has
            // to become clickable again for the retry.
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit: formikSubmit, isSubmitting }) => (
          <Form onSubmit={formikSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Cattleya"
                  value={values.name} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  isInvalid={touched.name && errors.name} 
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="description" 
                  placeholder="Description of the category..."
                  value={values.description} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  isInvalid={touched.description && errors.description} 
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="premium-action" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Category')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CategoryModal;
