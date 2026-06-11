package org.cloud.repository;

import java.util.List;

import org.cloud.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepositoy extends JpaRepository<Company, Long> {

	List<Company> findByCompanyType(String companyType);
}
