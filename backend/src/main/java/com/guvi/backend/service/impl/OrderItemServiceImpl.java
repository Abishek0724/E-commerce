package com.guvi.backend.service.impl;

import com.guvi.backend.dto.OrderItemDto;
import com.guvi.backend.dto.OrderRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.entity.Order;
import com.guvi.backend.entity.OrderItem;
import com.guvi.backend.entity.Product;
import com.guvi.backend.entity.User;
import com.guvi.backend.enums.OrderStatus;
import com.guvi.backend.exception.NotFoundException;
import com.guvi.backend.mapper.EntityDtoMapper;
import com.guvi.backend.repository.OrderItemRepo;
import com.guvi.backend.repository.OrderRepo;
import com.guvi.backend.repository.ProductRepo;
import com.guvi.backend.service.interf.OrderItemService;
import com.guvi.backend.service.interf.UserService;
import com.guvi.backend.specification.OrderItemSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {

        private final OrderRepo orderRepo;
        private final OrderItemRepo orderItemRepo;
        private final ProductRepo productRepo;
        private final UserService userService;
        private final EntityDtoMapper entityDtoMapper;

        @Override
        public Response placeOrder(OrderRequest orderRequest) {
                User user = userService.getLoginUser();

                List<OrderItem> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
                        Product product = productRepo.findById(orderItemRequest.getProductId())
                                        .orElseThrow(() -> new NotFoundException("Product Not Found"));

                        OrderItem orderItem = new OrderItem();
                        orderItem.setProduct(product);
                        orderItem.setQuantity(orderItemRequest.getQuantity());
                        orderItem.setPrice(product.getPrice()
                                        .multiply(BigDecimal.valueOf(orderItemRequest.getQuantity())));
                        orderItem.setStatus(OrderStatus.PENDING);
                        orderItem.setUser(user);
                        return orderItem;
                }).collect(Collectors.toList());

                BigDecimal totalPrice = orderRequest.getTotalPrice() != null
                                && orderRequest.getTotalPrice().compareTo(BigDecimal.ZERO) > 0
                                                ? orderRequest.getTotalPrice()
                                                : orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO,
                                                                BigDecimal::add);

                Order order = new Order();
                order.setOrderItemList(orderItems);
                order.setTotalPrice(totalPrice);

                orderItems.forEach(orderItem -> orderItem.setOrder(order));

                orderRepo.save(order);

                return Response.builder()
                                .status(200)
                                .message("Order was successfully placed")
                                .build();
        }

        @Override
        public Response updateOrderItemStatus(Long orderItemId, String status) {
                OrderItem orderItem = orderItemRepo.findById(orderItemId)
                                .orElseThrow(() -> new NotFoundException("Order Item not found"));

                orderItem.setStatus(OrderStatus.valueOf(status.toUpperCase()));
                orderItemRepo.save(orderItem);

                return Response.builder()
                                .status(200)
                                .message("Order status updated successfully")
                                .build();
        }

        @Override
        public Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate,
                        Long itemId, Pageable pageable) {
                Specification<OrderItem> spec = Specification.where(OrderItemSpecification.hasStatus(status))
                                .and(OrderItemSpecification.createdBetween(startDate, endDate))
                                .and(OrderItemSpecification.hasItemId(itemId));

                Page<OrderItem> orderItemPage = orderItemRepo.findAll(spec, pageable);

                if (orderItemPage.isEmpty()) {
                        throw new NotFoundException("No Order Found");
                }

                List<OrderItemDto> orderItemDtos = orderItemPage.getContent().stream()
                                .map(entityDtoMapper::mapOrderItemToDtoPlusProductAndUser)
                                .collect(Collectors.toList());

                return Response.builder()
                                .status(200)
                                .orderItemList(orderItemDtos)
                                .totalPage(orderItemPage.getTotalPages())
                                .totalElement(orderItemPage.getTotalElements())
                                .build();
        }

        @Override
        public Response updateOrderStatusAfterPayment(Long orderId) {
                Order order = orderRepo.findById(orderId)
                                .orElseThrow(() -> new NotFoundException("Order not found"));

                order.getOrderItemList().forEach(item -> {
                        item.setStatus(OrderStatus.CONFIRMED);
                        orderItemRepo.save(item);
                });

                return Response.builder()
                                .status(200)
                                .message("Payment verified and order status updated.")
                                .build();
        }
}
