package com.guvi.backend.service.interf;

import com.guvi.backend.dto.AddressDto;
import com.guvi.backend.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);
}