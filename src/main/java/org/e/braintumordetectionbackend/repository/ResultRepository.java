package org.e.braintumordetectionbackend.repository;

import org.e.braintumordetectionbackend.model.BtdUser;
import org.e.braintumordetectionbackend.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findAllByDoctor(BtdUser doctor);
    List<Result> findAllByPatient(BtdUser patient);
}
