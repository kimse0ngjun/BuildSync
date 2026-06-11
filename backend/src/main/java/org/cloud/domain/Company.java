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
@Table(name = "company")
public class Company {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long companyId;
	
	@Column(nullable = false, length = 20)
	private String companyType;
	
	@Column(nullable = false, length = 50, unique = true)
	private String loginId;
	
	@Column(nullable = false, length = 255)
	private String password;
	
	@Column(nullable = false, length = 100)
	private String companyName;
	
	@Column(nullable = true, length = 50)
	private String ceoName;
	
	@Column(nullable = true, length = 30)
	private String businessNumber;
	
	@Column(nullable = true, length = 255)
	private String address;
	
	@Column(nullable = true, length = 255)
	private String homepageUrl;
	
	@Column(nullable = true, length = 30)
	private String phone;
	
	@Column(nullable = false)
	private Date createdAt;
}
