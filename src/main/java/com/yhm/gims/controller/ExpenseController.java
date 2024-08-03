package com.yhm.gims.controller;


import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Expense;
import com.yhm.gims.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping(path = {"/api/expenses"})
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @GetMapping
    public Page<Expense> getExpenses(@RequestParam(required = false) String q, Pageable pageable) {
        return expenseService.getExpenses(q, pageable);
    }

    @PostMapping
    public ResponseEntity<Expense> save(@Valid @RequestBody Expense expense) {
        expenseService.save(expense);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("{id}")
    public ResponseEntity<Expense> update(@PathVariable int id, @RequestBody Expense expense) {
        Expense e = expenseService.update(expense, id);
        return ResponseEntity.ok(e);
    }
}
