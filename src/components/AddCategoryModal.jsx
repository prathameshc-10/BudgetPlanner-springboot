import React, { useState, useEffect } from 'react';

const ICON_OPTIONS = ['🏠', '🍔', '✈️', '🎬', '💊', '📚', '🚗', '👗', '💪', '🎮', '💡', '🐾'];
const COLOR_OPTIONS = [
  '#6366f1', '#f59e0b', '#10b981', '#ec4899',
  '#14b8a6', '#8b5cf6', '#f97316', '#06b6d4',
  '#84cc16', '#ef4444', '#3b82f6', '#a855f7',
];

function AddCategoryModal({ initialData, onSave, onClose }) {
  const [form, setForm] = useState({
    categoryName: '',
    allocatedAmount: '',
    icon: '💰',
    color: '#6366f1',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        categoryName: initialData.categoryName || '',
        allocatedAmount: initialData.allocatedAmount?.toString() || '',
        icon: initialData.icon || '💰',
        color: initialData.color || '#6366f1',
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.categoryName.trim()) errs.categoryName = 'Name is required';
    if (form.categoryName.trim().length > 100) errs.categoryName = 'Max 100 characters';
    if (!form.allocatedAmount) errs.allocatedAmount = 'Amount is required';
    if (parseFloat(form.allocatedAmount) < 0) errs.allocatedAmount = 'Amount must be >= 0';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        allocatedAmount: parseFloat(form.allocatedAmount),
        sortOrder: initialData?.sortOrder ?? 0,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal__header">
          <h3 className="modal__title">
            {initialData ? 'Edit Category' : 'Add Category'}
          </h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              className={`form-input ${errors.categoryName ? 'form-input--error' : ''}`}
              type="text"
              placeholder="e.g. Food, Rent, Travel..."
              value={form.categoryName}
              onChange={(e) => handleChange('categoryName', e.target.value)}
            />
            {errors.categoryName && (
              <span className="form-error">{errors.categoryName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Allocated Amount (₹) *</label>
            <input
              className={`form-input ${errors.allocatedAmount ? 'form-input--error' : ''}`}
              type="number"
              placeholder="e.g. 5000"
              min="0"
              value={form.allocatedAmount}
              onChange={(e) => handleChange('allocatedAmount', e.target.value)}
            />
            {errors.allocatedAmount && (
              <span className="form-error">{errors.allocatedAmount}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="icon-grid">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-btn ${form.icon === icon ? 'icon-btn--selected' : ''}`}
                  onClick={() => handleChange('icon', icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-grid">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${form.color === color ? 'color-btn--selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('color', color)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : initialData ? 'Update' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryModal;
