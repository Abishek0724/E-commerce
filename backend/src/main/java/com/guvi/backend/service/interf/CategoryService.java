package com.guvi.backend.service.interf;

import com.guvi.backend.dto.CategoryDto;
import com.guvi.backend.dto.Response;

public interface CategoryService {

    Response createCategory(CategoryDto categoryRequest);

    Response updateCategory(Long categoryId, CategoryDto categoryRequest);

    Response getAllCategories();

    Response getCategoryById(Long categoryId);

    Response deleteCategory(Long categoryId);
}