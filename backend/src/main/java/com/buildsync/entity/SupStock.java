package com.buildsync.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    
    public void changeCurStock(int currentQuantity) {
		this.currentQuantity = currentQuantity;
		this.updatedAt = LocalDateTime.now();
	}
}