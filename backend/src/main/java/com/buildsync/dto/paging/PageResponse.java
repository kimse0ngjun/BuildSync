package com.buildsync.dto.paging;

import java.util.List;

import org.springframework.data.domain.Pageable;

import lombok.Data;

@Data
public class PageResponse<T> {

	private List<T> list;
	private int pageNum;
	private int pageSize;
	private long totalElements;
	private int totalPages;
	
	public PageResponse(List<T> slicedList, Pageable pageable, long totalElements) {
		this.list = slicedList;
		this.pageNum = pageable.getPageNumber();
		this.pageSize = pageable.getPageSize();
		this.totalElements = totalElements;
		this.totalPages = (int) Math.ceil((double) totalElements / pageable.getPageSize());
	}
}
