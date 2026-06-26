package com.buildsync.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyDeleteResponse {

    private Long companyId;

    private String message;
}