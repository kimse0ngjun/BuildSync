package com.buildsync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sup_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sup_stock_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @Column(name = "current_quantity")
    private Integer currentQuantity;

    @Column(name = "minimum_quantity")
    private Integer minimumQuantity;

    @Column(name = "unit_price")
    private Integer unitPrice;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}