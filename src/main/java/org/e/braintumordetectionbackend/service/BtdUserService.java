package org.e.braintumordetectionbackend.service;

import org.e.braintumordetectionbackend.model.BtdUser;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.Optional;

public interface BtdUserService {
    void createUser(String name, String surname, String email, String password, String embg);
    BtdUser loginUser(String email, String password);
}
