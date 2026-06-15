package com.buildsync.repository.schedule;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.entity.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>{

	@Query("""
		    SELECT s FROM Schedule s
		    WHERE s.companyId = :companyId
		      AND s.startDate <= :lastDay
		      AND s.endDate   >= :firstDay
		""")
	List<Schedule> findByCompanyIdAndMonth(
			@Param("companyId") Long companyId,
			@Param("firstDay") LocalDate firstDay,
			@Param("lastDay") LocalDate lastDay
	);
	
	// 단건 조회
//    Optional<Schedule> findByScheduleIdAndCompany(Long scheduleId, Company company);
};
