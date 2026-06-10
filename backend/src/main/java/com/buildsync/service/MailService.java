package com.buildsync.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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
    
    public void sendResetPasswordMail(String to, String link) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("BuildSync 비밀번호 재설정");

        String html = """
            <div style="font-family: Arial;">
                <h2>비밀번호 재설정 요청</h2>
                <p>아래 버튼을 클릭해서 비밀번호를 변경하세요.</p>

                <a href="%s"
                   style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#4CAF50;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                        font-weight:bold;
                   ">
                   비밀번호 재설정
                </a>

                <p style="margin-top:20px; color:gray;">
                    10분 이내에 변경해주세요.
                </p>
            </div>
        """.formatted(link);

        helper.setText(html, true);

        mailSender.send(message);
    }
}