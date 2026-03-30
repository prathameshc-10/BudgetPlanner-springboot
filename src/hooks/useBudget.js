import { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../api/budgetApi';

const TOTAL_BUDGET_KEY = 'smart_budget_total';

export function useBudget() {
  const [categories, setCategories] = useState([]);
  const [totalBudget, setTotalBudget] = useState(
    () => parseFloat(localStorage.getItem(TOTAL_BUDGET_KEY)) || 100000
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived state
  const allocatedAmount = categories.reduce(
    (sum, c) => sum + parseFloat(c.allocatedAmount || 0), 0
  );
  const remaining = totalBudget - allocatedAmount;
  const allocationPercent = totalBudget > 0
    ? Math.min((allocatedAmount / totalBudget) * 100, 100)
    : 0;

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await budgetApi.getAll();
      setCategories(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    localStorage.setItem(TOTAL_BUDGET_KEY, totalBudget.toString());
  }, [totalBudget]);

  const addCategory = async (data) => {
    const res = await budgetApi.create({ ...data, sortOrder: categories.length });
    setCategories((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateCategory = async (id, data) => {
    const res = await budgetApi.update(id, data);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? res.data : c))
    );
    return res.data;
  };

  const deleteCategory = async (id) => {
    await budgetApi.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderCategories = (newOrder) => {
    setCategories(newOrder);
    // Persist new sort orders
    newOrder.forEach((cat, idx) => {
      budgetApi.update(cat.id, { ...cat, sortOrder: idx }).catch(console.error);
    });
  };

  return {
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
    refresh: fetchCategories,
  };
}
