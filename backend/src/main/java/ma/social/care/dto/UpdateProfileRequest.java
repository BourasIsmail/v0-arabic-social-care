package ma.social.care.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    @Size(min = 2, max = 100, message = "الاسم يجب أن يكون بين 2 و 100 حرف")
    private String fullName;
    
    @Size(min = 6, message = "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    private String currentPassword;
    
    @Size(min = 6, message = "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل")
    private String newPassword;
}
