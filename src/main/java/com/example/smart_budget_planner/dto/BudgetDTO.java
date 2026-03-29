package com.example.smart_budget_planner.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDTO {

    private Long id;

    @NotBlank(message = "Category name cannot be blank")
    private String categoryName;

    @NotNull(message = "Allocated amount is required")
    @Min(value = 0, message = "Amount must be >= 0")
    private BigDecimal allocatedAmount;

    private String icon;
    private String color;
    private Integer sortOrder;
}