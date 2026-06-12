package com.buildsync.repository.company;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

	@Query("SELECT c FROM Contact c WHERE c.company.companyId = :companyId")
	List<Contact> findByCompanyId(@Param("companyId") Long companyId);
}
