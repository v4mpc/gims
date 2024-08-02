package com.yhm.gims.service;

import com.yhm.gims.entity.Expense;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;


    public Page<Expense> findAll(Pageable pageable) {
        return expenseRepository.findAll(pageable);
    }

    public void save(Expense expense) {
        expenseRepository.save(expense);
    }


    public Expense update(Expense expense, int id) {
        Expense updateExpense = expenseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense not exist with id " + id));
        updateExpense.setName(expense.getName());
        updateExpense.setAmount(expense.getAmount());
        updateExpense.setCreatedAt(expense.getCreatedAt());
        updateExpense.setDescription(expense.getDescription());
        expenseRepository.save(updateExpense);
        return updateExpense;
    }


    public List<Expense> findByMonthAndYear(int month, int year){
        return expenseRepository.findByMonthAndYear(month,year);
    }
}
