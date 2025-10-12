package org.e.braintumordetectionbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Column(columnDefinition = "date")
    private LocalDate date;

    private Float confidence;

    private String classification;

    private String modelUsed;

    @Column(length = 2000)
    private String notes;

    @ManyToOne
    private BtdUser patient;

    @ManyToOne
    private BtdUser doctor;

    public Result(LocalDate date, Float confidence, String classification, String modelUsed, String notes, BtdUser patient, BtdUser doctor) {
        this.date = date;
        this.confidence = confidence;
        this.classification = classification;
        this.modelUsed = modelUsed;
        this.notes = notes;
        this.patient = patient;
        this.doctor = doctor;
    }

    public Result(){}

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public Float getConfidence() {
        return confidence;
    }

    public String getClassification() {
        return classification;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public String getNotes() {
        return notes;
    }

    public BtdUser getPatient() {
        return patient;
    }

    public BtdUser getDoctor() {
        return doctor;
    }
}
