package org.e.braintumordetectionbackend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendResultNotification(String toEmail, String patientName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Your NeuroScan AI Portal Result is Ready");

        String htmlContent = """
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center;">
                <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                  <img src='cid:logo' alt='NeuroScan Logo' style='width: 200px; height: auto; margin-bottom: 20px;'/>
                  <h2 style="color: #333;">Hello %s,</h2>
                  <p>Your medical result has been processed and is now available on the <b>NeuroScan AI Portal</b>.</p>
                  <a href="http://localhost:4200/patient"
                     style="display:inline-block;padding:10px 20px;
                            background:linear-gradient(to right, #3b82f6, #9333ea);
                            color:white;text-decoration:none;border-radius:8px;">
                    View Result
                  </a>
                </div>
              </body>
            </html>
        """.formatted(patientName);

        helper.setText(htmlContent, true);

        // Add logo as inline resource
        helper.addInline("logo", new org.springframework.core.io.FileSystemResource("/Users/sandrageorgiev/Desktop/brain-tumor-detection-backend/src/main/resources/static/images/logo.png"));

        mailSender.send(message);
    }
}
