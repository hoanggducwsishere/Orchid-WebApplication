package com.orchid.backend.config;

import com.orchid.backend.models.Category;
import com.orchid.backend.models.Orchid;
import com.orchid.backend.models.User;
import com.orchid.backend.repositories.CategoryRepository;
import com.orchid.backend.repositories.OrchidRepository;
import com.orchid.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrchidRepository orchidRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.seed.admin-email:admin@orchid.vn}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.seed.admin-password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User("System Admin", adminEmail, passwordEncoder.encode(adminPassword));
            admin.setAdmin(true);
            userRepository.save(admin);
            System.out.println(">>> Seeded default Admin user: " + adminEmail);
        }

        // 2. Seed Sample Categories if empty
        if (categoryRepository.count() == 0) {
            Category cat1 = new Category("Dendrobium", "Popular orchid species known for their vibrant colors and hardiness.");
            Category cat2 = new Category("Phalaenopsis", "Elegant moth orchids suitable for indoor home decoration.");
            Category cat3 = new Category("Vanda", "Exotic monopodial orchids with striking aerial root systems.");
            categoryRepository.save(cat1);
            categoryRepository.save(cat2);
            categoryRepository.save(cat3);
            System.out.println(">>> Seeded default Categories");
        }

        // 3. Seed Sample Orchids if empty
        if (orchidRepository.count() == 0) {
            Orchid o1 = new Orchid();
            o1.setName("Taeniophyllum glandulosum");
            o1.setCategory("Dendrobium");
            o1.setOrigin("Japan, Korea, Taiwan");
            o1.setColor("Yellow/Green");
            o1.setRating(4.8);
            o1.setImg("https://images.unsplash.com/photo-1525310072745-f49212b5ac6d");
            o1.setVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
            o1.setDescription("Taeniophyllum glandulosum is a miniature leafless epiphytic orchid species native to East Asia.");
            o1.setIsSpecial(true);
            o1.setIsNatural(true);
            orchidRepository.save(o1);

            Orchid o2 = new Orchid();
            o2.setName("Phalaenopsis amabilis");
            o2.setCategory("Phalaenopsis");
            o2.setOrigin("Southeast Asia");
            o2.setColor("White");
            o2.setRating(4.9);
            o2.setImg("https://images.unsplash.com/photo-1563241527-3004b7be0ffd");
            o2.setVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
            o2.setDescription("Known as the Moon Orchid, national flower of Indonesia with pure white blooms.");
            o2.setIsSpecial(false);
            o2.setIsNatural(true);
            orchidRepository.save(o2);
            
            System.out.println(">>> Seeded default Orchids");
        }
    }
}
