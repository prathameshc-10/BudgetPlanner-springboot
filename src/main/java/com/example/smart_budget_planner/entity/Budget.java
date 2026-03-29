package com.example.smart_budget_planner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budget_categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category name cannot be blank")
    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @NotNull(message = "Allocated amount cannot be null")
    @Min(value = 0, message = "Allocated amount must be >= 0")
    @Column(name = "allocated_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(name = "icon", length = 50)
    private String icon;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
