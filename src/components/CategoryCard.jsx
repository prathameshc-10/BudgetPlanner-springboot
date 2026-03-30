import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function CategoryCard({ category, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`category-card ${isDragging ? 'category-card--dragging' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag Handle */}
      <div
        className="category-card__drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        ⠿
      </div>

      {/* Color accent bar */}
      <div
        className="category-card__accent"
        style={{ backgroundColor: category.color || '#6366f1' }}
      />

      <div className="category-card__body">
        <div className="category-card__icon">{category.icon || '💰'}</div>
        <div className="category-card__info">
          <div className="category-card__name">{category.categoryName}</div>
          <div className="category-card__amount">{fmt(category.allocatedAmount)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className={`category-card__actions ${hovered ? 'category-card__actions--visible' : ''}`}>
        <button
          className="category-card__btn category-card__btn--edit"
          onClick={() => onEdit(category)}
          title="Edit"
        >
          ✎
        </button>
        <button
          className="category-card__btn category-card__btn--delete"
          onClick={() => onDelete(category.id)}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
