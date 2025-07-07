package com.guvi.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guvi.backend.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingOrDescriptionContaining(String name, String description);

}
