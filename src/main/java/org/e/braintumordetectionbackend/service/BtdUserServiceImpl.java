package org.e.braintumordetectionbackend.service;

import org.e.braintumordetectionbackend.model.BtdUser;
import org.e.braintumordetectionbackend.model.Role;
import org.e.braintumordetectionbackend.repository.BtdUserRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Optional;

@Service
public class BtdUserServiceImpl implements BtdUserService{
    private final BtdUserRepository btdUserRepository;

    public BtdUserServiceImpl(BtdUserRepository btdUserRepository) {
        this.btdUserRepository = btdUserRepository;
    }

    @Override
    public void createUser(String name, String surname, String email, String password, String embg) {
        BtdUser btd = new BtdUser(name, surname, Role.PATIENT, email, password, embg);
        this.btdUserRepository.save(btd);
    }

    @Override
    public BtdUser loginUser(String email, String password) {
        return this.btdUserRepository.findBtdUserByEmailAndPassword(email, password).orElse(null);
    }
}
