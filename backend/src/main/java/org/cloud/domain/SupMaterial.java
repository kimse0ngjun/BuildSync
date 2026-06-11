package org.cloud.domain;

import java.sql.Date;

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


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "sup_material")
public class SupMaterial {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long supMaterialId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id")
	private Company company;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "material_id")
	private Material material;

	@Column(nullable = true)
	private int currentStock;
	
	@Column(nullable = true)
	private int minimumStock;

	@Column(nullable = true)
	private Date updatedDate;
	
	@Column(nullable = true)
	private int unitPrice;
}
