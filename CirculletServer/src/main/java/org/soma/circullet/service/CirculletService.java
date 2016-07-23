package org.soma.circullet.service;

import org.soma.circullet.model.GameLog;
import org.soma.circullet.model.Users;
import org.soma.circullet.repository.GameLogRepository;
import org.soma.circullet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Baek on 2016-07-23.
 */
@Service
public class CirculletService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameLogRepository gameLogRepository;

    public Users getUser(Integer id) {
        return userRepository.findOne(id);
    }

    public Users getUserByFacebookId(String facebookId) {
        return userRepository.findByFacebookId(facebookId);
    }

    public void insertUser(Users user) {
        userRepository.save(user);
    }

    public void insertGameLog(GameLog gamelog) {
        gameLogRepository.save(gamelog);
    }

    public List<GameLog> getUserGameLogs(Integer userId) {
        return gameLogRepository.findByUserId(userId);
    }

    public void updateUsers(Users user) {
        userRepository.save(user);
    }
}
