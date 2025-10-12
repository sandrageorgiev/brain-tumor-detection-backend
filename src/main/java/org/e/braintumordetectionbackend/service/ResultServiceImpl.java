package org.e.braintumordetectionbackend.service;

import jakarta.persistence.*;
import lombok.Setter;
import org.e.braintumordetectionbackend.model.BtdUser;
import org.e.braintumordetectionbackend.model.Result;
import org.e.braintumordetectionbackend.repository.BtdUserRepository;
import org.e.braintumordetectionbackend.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ResultServiceImpl {
    private final ResultRepository resultRepository;
    private final BtdUserRepository btdUserRepository;

    @Autowired
    private EmailService emailService;

    public ResultServiceImpl(ResultRepository resultRepository, BtdUserRepository btdUserRepository) {
        this.resultRepository = resultRepository;
        this.btdUserRepository = btdUserRepository;
    }

    @Transactional
    public Result createResult(Float confidence,
                               String classification,
                               String modelUsed,
                               String notes,
                               String doctorEmail,
                               String patientEmbg) {

        // Fetch doctor and patient safely
        BtdUser doctor = btdUserRepository.findBtdUserByEmail(doctorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with id: " + doctorEmail));

        BtdUser patient = btdUserRepository.findBtdUserByEmbg(patientEmbg)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + patientEmbg));

        // Create new Result without setting ID
        Result result = new Result(LocalDate.now(), confidence, classification, modelUsed, notes, patient, doctor);

        // Save entity
        Result savedResult = resultRepository.save(result);

        // Send email notification asynchronously
        try {
            emailService.sendResultNotification(savedResult.getPatient().getEmail(), savedResult.getPatient().getName() + " " + savedResult.getPatient().getSurname());
        } catch (Exception e) {
            // Log exception but do not rollback transaction
            e.printStackTrace();
            // Optional: log to a logger instead of printing stack trace
        }

        return savedResult;
    }
    public List<Result> getDoctorResults(String username){
        BtdUser doctor = this.btdUserRepository.findBtdUserByEmail(username).get();
        return this.resultRepository.findAllByDoctor(doctor);
    }

    public List<Result> getPatientResults(String username){
        BtdUser patient = this.btdUserRepository.findBtdUserByEmail(username).get();
        return this.resultRepository.findAllByPatient(patient);
    }
}
