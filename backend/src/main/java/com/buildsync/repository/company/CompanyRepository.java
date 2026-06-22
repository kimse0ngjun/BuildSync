package com.buildsync.repository.company;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.dto.company.CompanyProjection;
import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;
import com.buildsync.entity.CompanyType;

import java.time.LocalDateTime;


@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
	
	// Auth
	Optional<Company> findByLoginId(String loginId);
	boolean existsByLoginId(String loginId);
	Optional<Company> findByEmail(String email);
	Optional<Company> findByPhone(String phone);
	boolean existsByEmail(String email);
	
	List<Company> findByCompanyType(CompanyType companyType);
	List<Company> findByStatus(CompanyStatus status);
	
	long countByStatus(CompanyStatus status);
	long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
	List<Company> findTop5ByOrderByCreatedAtDesc();
	
	Page<Company> findByStatus(CompanyStatus status, Pageable pageable);
	
	// Company
	@Query(value = """
	        SELECT
	            c.company_id AS companyId,
	            c.company_type AS companyType,
	            c.company_name AS companyName,
	            c.ceo_name AS ceoName,
	            c.phone AS phone,
	            c.address AS address,
	            c.created_at AS createdAt,

	            GROUP_CONCAT(
	                m.material_name
	            ) AS materials


	        FROM company c

	        LEFT JOIN sup_material sm
	            ON c.company_id = sm.company_id

	        LEFT JOIN material m
	            ON sm.material_id = m.material_id


	        WHERE

	        c.status = 'ACTIVE'

	        AND
	        (
	            :type IS NULL
	            OR c.company_type = :type
	        )

	        AND
	        (
	            :keyword IS NULL
	            OR c.company_name LIKE CONCAT('%',:keyword,'%')
	            OR c.ceo_name LIKE CONCAT('%',:keyword,'%')
	            OR c.phone LIKE CONCAT('%',:keyword,'%')
	        )


	        GROUP BY
	            c.company_id,
	            c.company_type,
	            c.company_name,
	            c.ceo_name,
	            c.phone,
	            c.address,
	            c.created_at

	        """, nativeQuery = true)
		Page<CompanyProjection> findCompanies(
		    @Param("type") String type,
		    @Param("keyword") String keyword,
		    Pageable pageable
		);
}