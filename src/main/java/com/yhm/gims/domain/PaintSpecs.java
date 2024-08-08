package com.yhm.gims.domain;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.entity.Product;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class PaintSpecs {
    public static Specification<Paint> searchByCustomerName(String searchTerm) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("customerCar").get("customer").get("name")), "%" + searchTerm.toLowerCase() + "%");
    }



    public static Specification<Paint> searchByCustomerPhone(String searchTerm) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("customerCar").get("customer").get("phone")), "%" + searchTerm.toLowerCase() + "%");
    }





    public static Specification<Paint> searchByCustomerPlateNumber(String searchTerm) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("customerCar").get("plateNumber")), "%" + searchTerm.toLowerCase() + "%");
    }

    public static Specification<Paint> searchByCustomerMake(String searchTerm) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("customerCar").get("make")), "%" + searchTerm.toLowerCase() + "%");
    }




    public static Specification<Paint> searchByCustomerModel(String searchTerm) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("customerCar").get("model")), "%" + searchTerm.toLowerCase() + "%");
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
