package com.example.smart_budget_planner.service;

import com.example.smart_budget_planner.dto.BudgetDTO;
import com.example.smart_budget_planner.entity.Budget;
import com.example.smart_budget_planner.exception.ResourceNotFoundException;
import com.example.smart_budget_planner.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BudgetDTO> getAllBudgets() {
        return budgetRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetDTO createBudget(BudgetDTO dto) {
        Budget budget = Budget.builder()
                .categoryName(dto.getCategoryName())
                .allocatedAmount(dto.getAllocatedAmount())
                .icon(dto.getIcon() != null ? dto.getIcon() : "💰")
                .color(dto.getColor() != null ? dto.getColor() : "#6366f1")
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();
        Budget saved = budgetRepository.save(budget);
        return toDTO(saved);
    }

    @Override
    public BudgetDTO updateBudget(Long id, BudgetDTO dto) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Budget category not found with id: " + id));

        budget.setCategoryName(dto.getCategoryName());
        budget.setAllocatedAmount(dto.getAllocatedAmount());
        if (dto.getIcon() != null) budget.setIcon(dto.getIcon());
        if (dto.getColor() != null) budget.setColor(dto.getColor());
        if (dto.getSortOrder() != null) budget.setSortOrder(dto.getSortOrder());

        Budget updated = budgetRepository.save(budget);
        return toDTO(updated);
    }

    @Override
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Budget category not found with id: " + id));
        budgetRepository.delete(budget);
    }

    private BudgetDTO toDTO(Budget budget) {
        return BudgetDTO.builder()
                .id(budget.getId())
                .categoryName(budget.getCategoryName())
                .allocatedAmount(budget.getAllocatedAmount())
                .icon(budget.getIcon())
                .color(budget.getColor())
                .sortOrder(budget.getSortOrder())
                .build();
    }
}
