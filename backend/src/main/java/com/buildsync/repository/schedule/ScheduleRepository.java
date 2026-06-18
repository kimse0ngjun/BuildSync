package com.buildsync.repository.schedule;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.entity.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>{

	// 공사 조회
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
	
	// 일정 계시판 조회
    Page<Schedule> findByCompanyId(
            Long companyId,
            Pageable pageable
    );
	
	// 상세 조회, 일정 수정
	Optional<Schedule> findByIdAndCompanyId(
	        Long id,
	        Long companyId
	);
	
	// 단건 조회
//    Optional<Schedule> findByScheduleIdAndCompany(Long scheduleId, Company company);
};
