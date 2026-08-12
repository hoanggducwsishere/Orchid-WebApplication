import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrchids, addOrchid, editOrchid, removeOrchid } from '../redux/orchidSlice';
import { fetchCategories, addCategory, editCategory, removeCategory } from '../redux/categorySlice';
import { Row, Col, Card, Button, Alert, Badge, Table, Tabs, Tab, Toast, ToastContainer } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import OrchidModal from '../components/OrchidModal';
import CategoryModal from '../components/CategoryModal';
import ConfirmModal from '../components/ConfirmModal';
import { resolveOrchidImage } from '../utils/imageHelper';
import StarRating from '../components/StarRating';

const Management = ({ isLoggedIn }) => {
  const dispatch = useDispatch();
  const { data: orchids = [], status: orchidStatus } = useSelector((state) => state.orchids);
  const orchidList = Array.isArray(orchids) ? orchids : [];

  const { data: categories = [], status: categoryStatus } = useSelector((state) => state.categories);
  const categoryList = Array.isArray(categories) ? categories : [];

  const [showOrchidModal, setShowOrchidModal] = useState(false);
  const [currentOrchid, setCurrentOrchid] = useState(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [activeTab, setActiveTab] = useState('orchids');

  // Holds the wording plus the action to run when the user confirms a deletion.
  // Null means no dialog is open.
  const [confirmState, setConfirmState] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchOrchids());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleShowEditOrchid = (orchid) => {
    setCurrentOrchid(orchid);
    setShowOrchidModal(true);
  };

  const handleShowAddOrchid = () => {
    setCurrentOrchid(null);
    setShowOrchidModal(true);
  };

  const handleCloseOrchidModal = () => {
    setShowOrchidModal(false);
    setCurrentOrchid(null);
  };

  // The modal stays open when saving fails, otherwise a server error would throw
  // away everything the user just typed without telling them why.
  const handleSubmitOrchidForm = async (values) => {
    try {
      if (currentOrchid) {
        await dispatch(editOrchid({ id: currentOrchid.id, data: values })).unwrap();
        setToast({ ok: true, text: 'Orchid updated successfully.' });
      } else {
        await dispatch(addOrchid(values)).unwrap();
        setToast({ ok: true, text: 'Orchid created successfully.' });
      }
      setShowOrchidModal(false);
      setCurrentOrchid(null);
    } catch {
      setToast({ ok: false, text: 'Could not save the orchid. Please try again.' });
    }
  };

  const handleShowEditCategory = (category) => {
    setCurrentCategory(category);
    setShowCategoryModal(true);
  };

  const handleShowAddCategory = () => {
    setCurrentCategory(null);
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCurrentCategory(null);
  };

  const handleSubmitCategoryForm = async (values) => {
    try {
      if (currentCategory) {
        await dispatch(editCategory({ id: currentCategory.id, data: values })).unwrap();
        setToast({ ok: true, text: 'Category updated successfully.' });
      } else {
        await dispatch(addCategory(values)).unwrap();
        setToast({ ok: true, text: 'Category created successfully.' });
      }
      setShowCategoryModal(false);
      setCurrentCategory(null);
    } catch {
      setToast({ ok: false, text: 'Could not save the category. Please try again.' });
    }
  };

  const handleDeleteOrchid = (orchid) => {
    setConfirmState({
      title: 'Delete this orchid?',
      message: `"${orchid.name}" will be permanently removed from the collection. This cannot be undone.`,
      successText: 'Orchid deleted.',
      failureText: 'Could not delete the orchid. Please try again.',
      run: () => dispatch(removeOrchid(orchid.id)).unwrap(),
    });
  };

  const handleDeleteCategory = (category) => {
    setConfirmState({
      title: 'Delete this category?',
      message: `"${category.name}" will be removed. Orchids in this category will not be deleted.`,
      successText: 'Category deleted.',
      failureText: 'Could not delete the category. Please try again.',
      run: () => dispatch(removeCategory(category.id)).unwrap(),
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmState) return;

    setIsDeleting(true);
    try {
      await confirmState.run();
      setToast({ ok: true, text: confirmState.successText });
      setConfirmState(null);
    } catch {
      setToast({ ok: false, text: confirmState.failureText });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">
          <h4>Access Denied</h4>
          <p>You must be logged in to access the management panel.</p>
        </Alert>
      </Container>
    );
  }

  if (orchidStatus === 'loading' || categoryStatus === 'loading') return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="mt-4 pb-5">
      {/* Premium Admin Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="text-start">
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-h)', letterSpacing: '-0.02em' }}>Orchid Database Administrator</h2>
          <p className="text-muted mb-0">System management panel to create, update, or remove orchid species in real-time.</p>
        </div>
        <Button variant="premium-action" className="px-4 py-2 d-flex align-items-center gap-2" onClick={activeTab === 'orchids' ? handleShowAddOrchid : handleShowAddCategory}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {activeTab === 'orchids' ? 'Add New Orchid' : 'Add New Category'}
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 custom-tabs"
      >
        <Tab eventKey="orchids" title="Orchids">

      {!orchidList.length ? (
        <Alert variant="info" className="rounded-3 shadow-sm text-start">
          No orchids available yet. Click the "Add New Orchid" button to create your first botanical record.
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: 'var(--light-surface)' }}>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="management-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Origin</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ width: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-start">
                  {orchidList.map((orchid) => (
                    <tr key={orchid.id}>
                      <td>
                        <img 
                          src={resolveOrchidImage(orchid.img)} 
                          alt={orchid.name} 
                          style={{ 
                            width: '55px', 
                            height: '55px', 
                            objectFit: 'cover', 
                            borderRadius: '0.6rem',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                          }} 
                        />
                      </td>
                      <td className="fw-bold" style={{ color: 'var(--text-h)' }}>{orchid.name}</td>
                      <td>{orchid.category || 'Unknown'}</td>
                      <td>{orchid.origin || 'Unknown'}</td>
                      <td>
                        <StarRating rating={orchid.rating} size={14} />
                      </td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          {orchid.isSpecial && <Badge className="admin-badge-special">Special</Badge>}
                          {orchid.isNatural ? (
                            <Badge className="admin-badge-natural">Natural</Badge>
                          ) : (
                            <Badge className="admin-badge-cultivated">Cultivated</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="warning" 
                            size="sm" 
                            className="action-btn-edit px-3 py-1.5"
                            onClick={() => handleShowEditOrchid(orchid)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="action-btn-delete px-3 py-1.5"
                            onClick={() => handleDeleteOrchid(orchid)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
        </Tab>
        <Tab eventKey="categories" title="Categories">
          {!categoryList.length ? (
            <Alert variant="info" className="rounded-3 shadow-sm text-start">
              No categories available yet. Click the "Add New Category" button to create your first category.
            </Alert>
          ) : (
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: 'var(--light-surface)' }}>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="management-table mb-0 align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th style={{ width: '180px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-start">
                      {categoryList.map((category) => (
                        <tr key={category.id}>
                          <td className="text-muted">#{category.id}</td>
                          <td className="fw-bold" style={{ color: 'var(--text-h)' }}>{category.name}</td>
                          <td>{category.description || 'No description'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="warning" 
                                size="sm" 
                                className="action-btn-edit px-3 py-1.5"
                                onClick={() => handleShowEditCategory(category)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm" 
                                className="action-btn-delete px-3 py-1.5"
                                onClick={() => handleDeleteCategory(category)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>

      <OrchidModal 
        show={showOrchidModal} 
        handleClose={handleCloseOrchidModal} 
        handleSubmit={handleSubmitOrchidForm} 
        initialData={currentOrchid} 
      />

      <CategoryModal
        show={showCategoryModal}
        handleClose={handleCloseCategoryModal}
        handleSubmit={handleSubmitCategoryForm}
        initialData={currentCategory}
      />

      <ConfirmModal
        show={!!confirmState}
        handleClose={() => setConfirmState(null)}
        handleConfirm={handleConfirmDelete}
        title={confirmState?.title}
        message={confirmState?.message}
        isProcessing={isDeleting}
      />

      {/* containerPosition="fixed" pins the toast to the viewport. The default is
          position-absolute, which anchors it to the top of a 2000px-tall page —
          invisible whenever the user deletes a row near the bottom of the table. */}
      <ToastContainer position="bottom-end" containerPosition="fixed" className="p-4" style={{ zIndex: 1100 }}>
        <Toast
          show={!!toast}
          onClose={() => setToast(null)}
          bg={toast?.ok ? 'success' : 'danger'}
          delay={3500}
          autohide
        >
          <Toast.Body className="text-white fw-semibold">{toast?.text}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Management;
