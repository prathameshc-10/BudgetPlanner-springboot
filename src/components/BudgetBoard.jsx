import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import CategoryCard from './CategoryCard';

function BudgetBoard({ categories, loading, onEdit, onDelete, onReorder, onAddNew }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const newOrder = arrayMove(categories, oldIndex, newIndex);
    onReorder(newOrder);
  };

  if (loading) {
    return (
      <div className="board">
        <div className="board__skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="board">
      <div className="board__header">
        <h2 className="board__title">Budget Categories</h2>
        <button className="btn btn--primary" onClick={onAddNew}>
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="board__empty">
          <div className="board__empty-icon">📊</div>
          <p>No categories yet. Add your first budget category!</p>
          <button className="btn btn--primary" onClick={onAddNew}>
            + Add Category
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="board__grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}

export default BudgetBoard;
