package com.buildsync.service.auth;

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
    
    public void sendApprovalMail(String to, String companyName) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("[BuildSync] 가입 승인이 완료되었습니다.");

        String html = """
            <div style="font-family: Arial;">
                <h2>BuildSync 가입 승인 완료</h2>
                <p>안녕하세요, %s님.</p>
                <p>BuildSync 가입 요청이 승인되었습니다.</p>
                <p>이제 로그인 후 서비스를 이용하실 수 있습니다.</p>
            </div>
        """.formatted(companyName);

        helper.setText(html, true);
        mailSender.send(message);
    }

    public void sendRejectMail(String to, String companyName) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("[BuildSync] 가입 요청이 반려되었습니다.");

        String html = """
            <div style="font-family: Arial;">
                <h2>BuildSync 가입 요청 반려</h2>
                <p>안녕하세요, %s님.</p>
                <p>BuildSync 가입 요청이 반려되었습니다.</p>
                <p>입력하신 업체 정보를 다시 확인해주세요.</p>
            </div>
        """.formatted(companyName);

        helper.setText(html, true);
        mailSender.send(message);
    }
}