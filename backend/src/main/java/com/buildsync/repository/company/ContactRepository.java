package com.buildsync.repository.company;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

	@Query("SELECT c FROM Contact c WHERE c.company.id = :companyId")
	List<Contact> findByCompany_Id(@Param("companyId") Long companyId);
	
	@Query(value = """
	        SELECT * FROM contact 
	        WHERE company_id = :companyId 
	        LIMIT 1
	    """, nativeQuery = true)
	Contact findDefaultContactByCompanyId(@Param("companyId") Long companyId);
}
