package org.soma.circullet.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by Baek on 2016-07-23.
 */
@Entity
public class Users implements Serializable {
    @Id
    @GeneratedValue
    private Integer id;

    private String facebookId;
    private String userName;
    private Date firstDate;
    private Date lastLaunchDate;
    private Date lastGameDate;

    public Date getFirstDate() {
        return firstDate;
    }

    public void setFirstDate(Date firstDate) {
        this.firstDate = firstDate;
    }

    public Date getLastLaunchDate() {
        return lastLaunchDate;
    }

    public void setLastLaunchDate(Date lastLaunchDate) {
        this.lastLaunchDate = lastLaunchDate;
    }

    public Date getLastGameDate() {
        return lastGameDate;
    }

    public void setLastGameDate(Date lastGameDate) {
        this.lastGameDate = lastGameDate;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFacebookId() {
        return facebookId;
    }

    public void setFacebookId(String facebookId) {
        this.facebookId = facebookId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
