package com.guvi.backend.service.interf;

import java.time.LocalDateTime;
import org.springframework.data.domain.Pageable;
import com.guvi.backend.dto.OrderRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.enums.OrderStatus;

public interface OrderItemService {
    Response placeOrder(OrderRequest orderRequest);

    Response updateOrderItemStatus(Long orderItemId, String status);

    Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId,
            Pageable pageable);

    Response updateOrderStatusAfterPayment(Long orderId);
}
