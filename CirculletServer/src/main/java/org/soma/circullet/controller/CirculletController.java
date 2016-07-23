package org.soma.circullet.controller;

import org.soma.circullet.dto.GameLogDto;
import org.soma.circullet.dto.UsersDto;
import org.soma.circullet.exception.AuthException;
import org.soma.circullet.model.GameLog;
import org.soma.circullet.model.Users;
import org.soma.circullet.service.AuthService;
import org.soma.circullet.service.CirculletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Baek on 2016-07-23.
 */
@RestController
public class CirculletController {

    @Autowired
    private CirculletService circulletService;

    @Autowired
    private AuthService authService;

    @RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
    public UsersDto getUser(@PathVariable Integer userId) {

        Users users = circulletService.getUser(userId);
        UsersDto usersDto = new UsersDto();
        usersDto.setId(users.getId());
        usersDto.setFacebookId(users.getFacebookId());
        usersDto.setLastLaunchDate(users.getLastLaunchDate());
        usersDto.setLastGameDate(users.getLastGameDate());
        usersDto.setFirstDate(users.getFirstDate());
        usersDto.setUserName(users.getUserName());

        return usersDto;
    }

    @RequestMapping(value = "/user/{userId}", method = RequestMethod.PUT)
    public void updateUser(@PathVariable Integer userId, @RequestParam String accessToken, @RequestParam(required = false) Long firstDate,
                            @RequestParam(required = false) Long lastLaunchDate, @RequestParam(required = false) Long lastGameDate) throws AuthException {
        Users user = authService.requestFacebookLogin(accessToken);
        String facebookId = user.getFacebookId();
        Users joinedUser = circulletService.getUserByFacebookId(facebookId);
        if (joinedUser == null) {
            throw new AuthException("Not Joined");
        }
        if (joinedUser.getId() != userId) {
            throw new AuthException("AccessToken is not given user's");
        }

        if(firstDate != null) {
            joinedUser.setFirstDate(new Date(firstDate));
        }
        if(lastGameDate != null) {
            joinedUser.setLastGameDate(new Date(lastGameDate));
        }
        if(lastLaunchDate != null) {
            joinedUser.setLastLaunchDate(new Date(lastLaunchDate));
        }

        circulletService.updateUsers(joinedUser);

        return;
    }

    @RequestMapping(value = "/gamelog/{userId}", method = RequestMethod.POST)
    public void insertGameLog(@PathVariable Integer userId, @RequestParam String accessToken, @RequestParam int playtime, @RequestParam int score) throws AuthException {
        Users user = authService.requestFacebookLogin(accessToken);
        String facebookId = user.getFacebookId();
        Users joinedUser = circulletService.getUserByFacebookId(facebookId);
        if (joinedUser == null) {
            throw new AuthException("Not Joined");
        }
        if (joinedUser.getId() != userId) {
            throw new AuthException("AccessToken is not given user's");
        }

        Date gamedate = new Date();
        GameLog gameLog = new GameLog();
        gameLog.setGameDate(gamedate);
        gameLog.setPlaytime(playtime);
        gameLog.setScore(score);
        gameLog.setUser(joinedUser);
        circulletService.insertGameLog(gameLog);

    }

    @RequestMapping(value = "/gamelog/{userId}", method = RequestMethod.GET)
    public List<GameLogDto> insertGameLog(@PathVariable Integer userId) {
        List<GameLog> gameLogList = circulletService.getUserGameLogs(userId);
        List<GameLogDto> gameLogDtoList = new ArrayList<GameLogDto>();

        for(GameLog gameLog : gameLogList) {
            GameLogDto gameLogDto = new GameLogDto();
            gameLogDto.setScore(gameLog.getScore());
            gameLogDto.setGameDate(gameLog.getGameDate());
            gameLogDto.setPlaytime(gameLog.getPlaytime());
            gameLogDto.setUserId(gameLog.getUser().getId());
            gameLogDtoList.add(gameLogDto);
        }
        return gameLogDtoList;
    }
}