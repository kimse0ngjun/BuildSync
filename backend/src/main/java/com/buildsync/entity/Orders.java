package com.buildsync.entity;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Orders {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orderId;
	
	@ManyToOne
	@JoinColumn(name = "site_id")
	private Site site;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "contact_id")
	private Contact contact;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id")
	private Company company;
	
	@Column(nullable = true)
	private Date orderDate;
	
	@Column(nullable = true)
	private Date expectedDeliveryDate;
	
	@Column(nullable = true)
	private Integer totalAmount;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private OrderStatus status = OrderStatus.PENDING;

	@Column(columnDefinition = "TEXT")
	private String memo;
	
	@OneToMany(mappedBy = "orders", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonManagedReference
	@Builder.Default
    private List<OrderItems> items = new ArrayList<>();
	
	public void modifyOrderDetails(String memo, List<OrderItems> newItems) {
        this.memo = memo;
        this.items.clear();
        
        if (newItems != null) {
            for (OrderItems item : newItems) {
                item.setOrders(this);
                this.items.add(item);
            }
        }
        
        this.totalAmount = this.items.stream()
        		.mapToInt(OrderItems::getAmount)
        		.sum();
    }
	
	public void changeStatus(OrderStatus status) {
		this.status = status;
	}
	
	public Long getConstructionCompanyId() {
		if (this.company != null) {
			return this.company.getId();
		}
		return null;
	}
}
