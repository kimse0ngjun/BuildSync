package org.cloud.domain;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	private int totalAmount;
	
	@Column(nullable = true, length = 30)
	private String status;
	
	@Column(columnDefinition = "TEXT")
	private String memo;
	
	@OneToMany(mappedBy = "orders", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderItems> items = new ArrayList<>();
}
