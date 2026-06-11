package com.buildsync.repository.company;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Company;


@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
	
	Optional<Company> findByLoginId(String loginId);
	boolean existsByLoginId(String loginId);
	Optional<Company> findByEmail(String email);
	Optional<Company> findByPhone(String phone);
	boolean existsByEmail(String email);
}
