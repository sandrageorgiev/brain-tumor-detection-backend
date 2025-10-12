package org.e.braintumordetectionbackend.web;

import org.e.braintumordetectionbackend.model.BtdUser;
import org.e.braintumordetectionbackend.service.BtdUserService;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/user")
public class BtdUserController {
    private final BtdUserService btdUserService;

    public BtdUserController(BtdUserService btdUserService) {
        this.btdUserService = btdUserService;
    }

    public static class UserRequest {
        public String email;
        public String password;
        public String name;
        public String surname;
        public String embg;
    }

    @PostMapping("/create")
    public void createUser(
            @RequestBody UserRequest userRequest
    ) {
        this.btdUserService.createUser(userRequest.name, userRequest.surname, userRequest.email, userRequest.password, userRequest.embg);
    }

    public static class UserLoginRequest {
        public String email;
        public String password;

    }

    @PostMapping("/login")
    public ResponseEntity<BtdUser> login(
            @RequestBody UserLoginRequest userLoginRequest
    ) throws ChangeSetPersister.NotFoundException {
            BtdUser user = this.btdUserService.loginUser(userLoginRequest.email, userLoginRequest.password);
            if (user != null){
                return ResponseEntity.ok(user);
            }
            else {
                throw new ChangeSetPersister.NotFoundException();
            }
    }


}
