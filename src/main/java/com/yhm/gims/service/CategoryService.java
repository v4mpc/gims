package com.yhm.gims.service;


import com.yhm.gims.entity.Category;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;


    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }


    public Page<Category> getCategories(String searchTerm, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            return categoryRepository.findAll(pageable);
        } else {
            return categoryRepository.search(searchTerm, pageable);
        }

    }


    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public void save(Category category) {
        categoryRepository.save(category);
    }

    public Category update(Category category, int id) {
        Category updateCategory = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not exist with id " + id));
        updateCategory.setName(category.getName());
        categoryRepository.save(updateCategory);
        return updateCategory;
    }
}
