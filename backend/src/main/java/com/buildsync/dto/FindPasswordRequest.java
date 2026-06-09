package com.buildsync.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPasswordRequest {

    private String token;
    private String newPassword;
}
