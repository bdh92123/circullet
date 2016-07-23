package org.soma.circullet.repository;

import org.soma.circullet.model.GameLog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Baek on 2016-07-23.
 */
@Repository
public interface GameLogRepository extends CrudRepository<GameLog, Integer>{
    List<GameLog> findByUserId(Integer userId);
}
