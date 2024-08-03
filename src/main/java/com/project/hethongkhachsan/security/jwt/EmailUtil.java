package com.project.hethongkhachsan.security.jwt;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EmailUtil {
	 public static void sendOTPEmail(String toEmail, String otp) throws MessagingException {
	        // Cấu hình thông tin mail server
	        String host = "smtp.gmail.com"; 
	        String port = "587"; 
	        String username = "hoangpubg286@gmail.com";
	        String password = "vhel joua rqjf gyne"; 
	        
	        Properties props = new Properties();
	        props.put("mail.smtp.auth", "true");
	        props.put("mail.smtp.starttls.enable", "true");
	        props.put("mail.smtp.host", host);
	        props.put("mail.smtp.port", port);
	        
	        // Tạo đối tượng Session để kết nối với mail server
	        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
	            protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
	                return new javax.mail.PasswordAuthentication(username, password);
	            }
	        });
	        
	        try {
	            // Tạo đối tượng MimeMessage
	            MimeMessage message = new MimeMessage(session);
	            message.setFrom(new InternetAddress(username));
	            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
	            message.setSubject("Xác thực OTP");
	            message.setText("Mã OTP của bạn là: " + otp);
	            
	            // Gửi email
	            Transport.send(message);
	            System.out.println("Gửi email thành công đến " + toEmail);
	        } catch (MessagingException e) {
	            System.out.println("Gửi email thất bại đến " + toEmail);
	            throw e;
	        }
	    }
}
