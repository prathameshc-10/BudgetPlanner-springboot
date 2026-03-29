package com.example.smart_budget_planner.service;

import com.example.smart_budget_planner.dto.BudgetDTO;

import java.util.List;

public interface BudgetService {
    List<BudgetDTO> getAllBudgets();
    BudgetDTO createBudget(BudgetDTO dto);
    BudgetDTO updateBudget(Long id, BudgetDTO dto);
    void deleteBudget(Long id);
}
