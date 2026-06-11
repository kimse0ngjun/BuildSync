package org.cloud.domain;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "material")
public class Material {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long materialId;
	
	@Column(nullable = false, length = 50, unique = true)
	private String materialCode;
	
	@Column(nullable = false, length = 100)
	private String materialName;
	
	@Column(nullable = true, length = 50)
	private String materialCategory;
	
	@Column(nullable = true, length = 20)
	private String unit;
	
	@Column(nullable = true, length = 100)
	private String specification;
	
	@Column(nullable = true)
	private Date createdAt;
}
