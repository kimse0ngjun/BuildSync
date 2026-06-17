package com.buildsync.repository.company;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;


@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
	
	// Auth
	Optional<Company> findByLoginId(String loginId);
	boolean existsByLoginId(String loginId);
	Optional<Company> findByEmail(String email);
	Optional<Company> findByPhone(String phone);
	boolean existsByEmail(String email);
	
	List<Company> findByCompanyType(String companyType);
	List<Company> findByStatus(CompanyStatus status);
}
