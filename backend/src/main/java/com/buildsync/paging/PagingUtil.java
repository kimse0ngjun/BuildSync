package com.buildsync.paging;

import java.util.List;

import org.springframework.data.domain.Pageable;

public class PagingUtil {

	public static <T> List<T> getSlicedList(List<T> totalList, Pageable pageable) {
		int offset = (int)pageable.getOffset();
		int limit = pageable.getPageSize();
		
		if (offset >= totalList.size()) {
            return List.of();
        }
		
		int toIndex = Math.min(offset + limit, totalList.size());
        return totalList.subList(offset, toIndex);
	}
}
