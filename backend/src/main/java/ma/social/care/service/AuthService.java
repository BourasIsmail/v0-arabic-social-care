package ma.social.care.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.auth.LoginRequest;
import ma.social.care.dto.auth.LoginResponse;
import ma.social.care.dto.auth.RegisterRequest;
import ma.social.care.entity.User;
import ma.social.care.entity.enums.Role;
import ma.social.care.exception.ResourceNotFoundException;
import ma.social.care.repository.UserRepository;
import ma.social.care.security.JwtService;
import ma.social.care.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .regionId(request.getRegionId())
                .prefectureId(request.getPrefectureId())
                .isActive(true)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully with ID: {}", user.getId());

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return buildLoginResponse(user, accessToken, refreshToken);
    }

    public LoginResponse login(LoginRequest request) {
        log.info("Attempting login for user: {}", request.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getEmail()));

            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            log.info("User logged in successfully: {}", request.getEmail());
            return buildLoginResponse(user, accessToken, refreshToken);
            
        } catch (BadCredentialsException e) {
            log.warn("Invalid login attempt for email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public LoginResponse refreshToken(String refreshToken) {
        String userEmail = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(userDetails);
        return buildLoginResponse(user, newAccessToken, refreshToken);
    }

    public LoginResponse.UserInfo getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        return LoginResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .regionId(user.getRegionId())
                .prefectureId(user.getPrefectureId())
                .build();
    }

    private LoginResponse buildLoginResponse(User user, String accessToken, String refreshToken) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs() / 1000)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .regionId(user.getRegionId())
                        .prefectureId(user.getPrefectureId())
                        .build())
                .build();
    }
}
