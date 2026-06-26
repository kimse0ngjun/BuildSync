package com.buildsync.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContactResponse {

	private Long contactId;
    private String contactName;
    private String phone;
    private String email;
}
