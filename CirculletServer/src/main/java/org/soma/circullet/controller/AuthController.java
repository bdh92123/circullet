package org.soma.circullet.controller;

import org.soma.circullet.dto.UsersDto;
import org.soma.circullet.exception.AuthException;
import org.soma.circullet.model.Users;
import org.soma.circullet.service.AuthService;
import org.soma.circullet.service.CirculletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Baek on 2016-07-23.
 */
@RestController
public class AuthController {

    @Autowired
    private CirculletService circulletService;

    @Autowired
    private AuthService authService;

    @RequestMapping(value="/login", method = RequestMethod.POST)
    public UsersDto login(@RequestParam String accessToken) throws AuthException {
        Users user = authService.requestFacebookLogin(accessToken);
        if(user != null) {
            Users joinedUser = circulletService.getUserByFacebookId(user.getFacebookId());
            if(joinedUser == null) {
                circulletService.insertUser(user);
            } else {
                user = joinedUser;
            }
        } else {
            throw new AuthException("Facebook Login Fail");
        }

        UsersDto usersDto = new UsersDto();
        usersDto.setUserName(user.getUserName());
        usersDto.setId(user.getId());
        usersDto.setFacebookId(user.getFacebookId());
        return usersDto;
    }

}
