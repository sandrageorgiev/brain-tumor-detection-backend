package org.e.braintumordetectionbackend.repository;

import org.e.braintumordetectionbackend.model.BtdUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BtdUserRepository extends JpaRepository<BtdUser, Long> {
    Optional<BtdUser> findBtdUserByEmailAndPassword(String email, String password);
    Optional<BtdUser> findBtdUserByEmail(String username);
    Optional<BtdUser> findBtdUserByEmbg(String embg);

}
