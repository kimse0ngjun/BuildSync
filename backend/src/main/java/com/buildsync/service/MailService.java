package com.buildsync.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

//    public void sendFindIdMail(String to, String loginId) {
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject("BuildSync 아이디 찾기 결과");
//
//        message.setText(
//                "BuildSync 운영진입니다.\n\n" +
//                "요청하신 아이디 정보입니다.\n\n" +
//                "아이디: " + loginId + "\n\n" +
//                "감사합니다."
//        );
//
//        mailSender.send(message);
//    }
    
    public void sendResetPasswordMail(String to, String link) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("BuildSync 비밀번호 재설정");

        message.setText(
                "비밀번호 재설정 링크입니다.\n\n" +
                link + "\n\n" +
                "10분 이내에 변경해주세요."
        );

        mailSender.send(message);
    }
}