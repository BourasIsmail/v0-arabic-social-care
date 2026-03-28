package ma.social.care.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.social.care.dto.UpdateProfileRequest;
import ma.social.care.dto.UserDTO;
import ma.social.care.entity.User;
import ma.social.care.entity.Region;
import ma.social.care.entity.Prefecture;
import ma.social.care.repository.UserRepository;
import ma.social.care.repository.RegionRepository;
import ma.social.care.repository.PrefectureRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final PrefectureRepository prefectureRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(mapToDTO(user));
    }

    @PutMapping
    public ResponseEntity<UserDTO> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update full name if provided
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        // Update password if provided
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            // Verify current password
            if (request.getCurrentPassword() == null || 
                !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("كلمة المرور الحالية غير صحيحة");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToDTO(updatedUser));
    }

    private UserDTO mapToDTO(User user) {
        String regionName = null;
        String prefectureName = null;
        
        if (user.getRegionId() != null) {
            regionName = regionRepository.findById(user.getRegionId())
                    .map(Region::getName)
                    .orElse(null);
        }
        
        if (user.getPrefectureId() != null) {
            prefectureName = prefectureRepository.findById(user.getPrefectureId())
                    .map(Prefecture::getName)
                    .orElse(null);
        }
        
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .regionId(user.getRegionId())
                .prefectureId(user.getPrefectureId())
                .regionName(regionName)
                .prefectureName(prefectureName)
                .build();
    }
}
