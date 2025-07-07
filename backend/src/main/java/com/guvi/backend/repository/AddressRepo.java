package com.guvi.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.guvi.backend.entity.Address;

public interface AddressRepo extends JpaRepository<Address, Long> {

}
