package com.yhm.gims.domain;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Product;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecs {
    public static Specification<Product> searchByName(String searchTerm) {
        return (root, query, builder) -> builder.like(root.get("name"), "%" + searchTerm.toLowerCase() + "%");
    }

    public static Specification<Product> searchByCode(String searchTerm) {
        return (root, query, builder) -> builder.like(root.get("code"), "%" + searchTerm.toLowerCase() + "%");
    }


    public static Specification<Product> searchByCategory(Integer categoryId) {


        return (root, query, builder) -> {
            Join<Product, Category> productCategory = root.join("category");
            return builder.equal(productCategory.get("id"), categoryId);
        };
    }
}
