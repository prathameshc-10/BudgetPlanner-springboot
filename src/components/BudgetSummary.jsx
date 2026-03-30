import React, { useState } from 'react';

function BudgetSummary({
  totalBudget,
  setTotalBudget,
  allocatedAmount,
  remaining,
  allocationPercent,
}) {
  const [editingTotal, setEditingTotal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const handleTotalClick = () => {
    setInputValue(totalBudget.toString());
    setEditingTotal(true);
  };

  const handleTotalBlur = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val >= 0) setTotalBudget(val);
    setEditingTotal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleTotalBlur();
    if (e.key === 'Escape') setEditingTotal(false);
  };

  const isOverBudget = remaining < 0;

  return (
    <section className="summary">
      <div className="summary__cards">
        <div className="summary__card summary__card--total">
          <div className="summary__card-label">Total Budget</div>
          {editingTotal ? (
            <input
              className="summary__edit-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleTotalBlur}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <div
              className="summary__card-value summary__card-value--clickable"
              onClick={handleTotalClick}
              title="Click to edit"
            >
              {fmt(totalBudget)}
              <span className="summary__edit-hint">✎</span>
            </div>
          )}
        </div>

        <div className="summary__card summary__card--allocated">
          <div className="summary__card-label">Allocated</div>
          <div className="summary__card-value">{fmt(allocatedAmount)}</div>
          <div className="summary__card-sub">
            {allocationPercent.toFixed(1)}% of budget
          </div>
        </div>

        <div className={`summary__card ${isOverBudget ? 'summary__card--danger' : 'summary__card--remaining'}`}>
          <div className="summary__card-label">
            {isOverBudget ? '⚠️ Over Budget' : 'Remaining'}
          </div>
          <div className="summary__card-value">{fmt(Math.abs(remaining))}</div>
          <div className="summary__card-sub">
            {isOverBudget ? 'Reduce allocations' : 'Available to allocate'}
          </div>
        </div>
      </div>

      <div className="summary__progress-bar">
        <div
          className={`summary__progress-fill ${isOverBudget ? 'summary__progress-fill--danger' : ''}`}
          style={{ width: `${allocationPercent}%` }}
        />
      </div>
      <div className="summary__progress-labels">
        <span>0%</span>
        <span>{allocationPercent.toFixed(1)}% allocated</span>
        <span>100%</span>
      </div>
    </section>
  );
}

export default BudgetSummary;
