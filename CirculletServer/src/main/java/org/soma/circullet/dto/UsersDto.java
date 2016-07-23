package org.soma.circullet.dto;

import lombok.Data;

import java.util.Date;

/**
 * Created by Baek on 2016-07-23.
 */
@Data
public class UsersDto {
    private Integer id;
    private String facebookId;
    private String userName;
    private Date firstDate;
    private Date lastLaunchDate;
    private Date lastGameDate;
}
