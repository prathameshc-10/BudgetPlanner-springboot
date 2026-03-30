import React, { useState } from 'react';
import Header from './components/Header';
import BudgetSummary from './components/BudgetSummary';
import BudgetBoard from './components/BudgetBoard';
import AddCategoryModal from './components/AddCategoryModal';
import { useBudget } from './hooks/useBudget';
import './styles/App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [notification, setNotification] = useState(null);

  const {
    categories,
    totalBudget,
    setTotalBudget,
    allocatedAmount,
    remaining,
    allocationPercent,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useBudget();

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        showNotification('Category updated!');
      } else {
        await addCategory(data);
        showNotification('Category added!');
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id);
        showNotification('Category deleted.');
      } catch (err) {
        showNotification(err.message, 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="app">
      <Header />

      {notification && (
        <div className={`notification notification--${notification.type}`}>
          {notification.msg}
        </div>
      )}

      {error && (
        <div className="error-banner">
          ⚠️ {error} — Make sure the backend is running on port 8080.
        </div>
      )}

      <main className="main-content">
        <BudgetSummary
          totalBudget={totalBudget}
          setTotalBudget={setTotalBudget}
          allocatedAmount={allocatedAmount}
          remaining={remaining}
          allocationPercent={allocationPercent}
        />

        <BudgetBoard
          categories={categories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={reorderCategories}
          onAddNew={() => setShowModal(true)}
        />
      </main>

      {showModal && (
        <AddCategoryModal
          initialData={editingCategory}
          onSave={handleSaveCategory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
