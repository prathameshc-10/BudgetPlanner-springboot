package com.example.smart_budget_planner.controller;

import com.example.smart_budget_planner.dto.BudgetDTO;
import com.example.smart_budget_planner.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@Valid @RequestBody BudgetDTO dto) {
        BudgetDTO created = budgetService.createBudget(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetDTO dto) {
        BudgetDTO updated = budgetService.updateBudget(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}