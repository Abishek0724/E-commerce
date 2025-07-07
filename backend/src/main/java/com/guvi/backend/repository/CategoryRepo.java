package com.guvi.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guvi.backend.entity.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {

}
