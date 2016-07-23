package org.soma.circullet.service;

import org.json.JSONObject;
import org.soma.circullet.exception.AuthException;
import org.soma.circullet.model.Users;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by Baek on 2016-07-23.
 */
@Service
public class AuthService {

    public Users requestFacebookLogin(String accessToken) throws AuthException {
        try {
            StringBuilder sb = new StringBuilder();
            BufferedReader br;
            URLConnection con = new URL(
                    "https://graph.facebook.com/v2.7/me?fields=id,name&access_token=" + accessToken)
                    .openConnection();
            br = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            JSONObject rootObject = new JSONObject(sb.toString());
            String id = rootObject.getString("id");
            String name = rootObject.getString("name");

            Users user = new Users();
            user.setFacebookId(id);
            user.setUserName(name);

            return user;
        } catch (Exception e) {
            throw new AuthException("Facebook Login Fail");
        }
    }
}
