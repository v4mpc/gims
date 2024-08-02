package com.yhm.gims.service;

import com.yhm.gims.domain.SecurityUser;
import com.yhm.gims.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@AllArgsConstructor
@Service
public class JpaUserDetailsService implements UserDetailsService {

    public final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).map(SecurityUser::new).orElseThrow(()->new UsernameNotFoundException("Username not found "+username));
    }
}
