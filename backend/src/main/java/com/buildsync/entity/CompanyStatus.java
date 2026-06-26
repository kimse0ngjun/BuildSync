package com.buildsync.entity;

public enum CompanyStatus {
    PENDING,   // 승인 대기
    ACTIVE,    // 승인 완료
    REJECTED,  // 반려
    INACTIVE   // 탈퇴/비활성화
}