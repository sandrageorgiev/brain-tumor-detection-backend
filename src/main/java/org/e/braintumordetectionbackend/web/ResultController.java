package org.e.braintumordetectionbackend.web;

import org.apache.coyote.Response;
import org.e.braintumordetectionbackend.model.Result;
import org.e.braintumordetectionbackend.service.ResultServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/result")
public class ResultController {
    private final ResultServiceImpl resultService;


    public ResultController(ResultServiceImpl resultService) {
        this.resultService = resultService;
    }

    public static class ResultRequest{
        float confidence;
        String classification;
        String modelUsed;
        String notes;
        String patientEmbg;
        String doctorEmail;

        // Getters and setters (or use @Data from Lombok)
        public float getConfidence() { return confidence; }
        public void setConfidence(float confidence) { this.confidence = confidence; }

        public String getClassification() { return classification; }
        public void setClassification(String classification) { this.classification = classification; }

        public String getModelUsed() { return modelUsed; }
        public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public String getPatientEmbg() { return patientEmbg; }
        public void setPatientEmbg(String patientEmbg) { this.patientEmbg = patientEmbg; }

        public String getDoctorEmail() { return doctorEmail; }
        public void setDoctorEmail(String doctorEmail) { this.doctorEmail = doctorEmail; }
    }

    @GetMapping("/doctor/{username}")
    public ResponseEntity<List<Result>> getDoctorResults(
            @PathVariable String username
    ){
        return ResponseEntity.ok(this.resultService.getDoctorResults(username));

    }

    @GetMapping("/patient/{username}")
    public ResponseEntity<List<Result>> getPatientResults(
            @PathVariable String username
    ){
        return ResponseEntity.ok(this.resultService.getPatientResults(username));

    }


    @PostMapping("/save")
    public ResponseEntity<Result> saveResult(@RequestBody ResultRequest resultRequest){
        return ResponseEntity.ok(this.resultService.createResult(resultRequest.confidence, resultRequest.classification, resultRequest.modelUsed, resultRequest.notes, resultRequest.doctorEmail, resultRequest.patientEmbg));
    }
}
