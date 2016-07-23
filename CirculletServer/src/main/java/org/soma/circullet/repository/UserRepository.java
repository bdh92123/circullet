package org.soma.circullet.repository;

import org.soma.circullet.model.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Baek on 2016-07-23.
 */
@Repository
public interface UserRepository extends CrudRepository<Users, Integer> {
    Users findByFacebookId(String facebookId);
}
