package com.buildsync.entity;

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
import lombok.Setter;

@Entity
@Table(name = "company")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "company_id")
	private Long id;
	
	@Column(nullable = false, unique = true)
	private String loginId;
	
    @Column(nullable = false)
	private String password;
    
    @Column(nullable = false)
    private String companyType;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String ceoName;

    @Column(nullable = false, unique = true)
    private String businessNumber;

    @Column(nullable = false)
    private String phone;

    private String homepageUrl;

    @Column(nullable = false)
    private String address;
	
	@Column(unique = true)
	private String email;
}
