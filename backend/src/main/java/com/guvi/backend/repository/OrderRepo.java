package com.guvi.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guvi.backend.entity.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {

}
