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

        // 2. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Moth Orchid", "Known as Phalaenopsis, one of the most popular and easy-to-grow orchids."));
            categoryRepository.save(new Category("Boat Orchid", "Cymbidium orchids prized for their long-lasting sprays of flowers."));
            categoryRepository.save(new Category("Dendrobium", "Popular orchid genus with prolific blooming along the cane."));
            categoryRepository.save(new Category("Corsage Orchid", "Cattleya orchids famous for their large, fragrant blooms."));
            categoryRepository.save(new Category("Vanda", "Monopodial orchids known for vibrant and fragrant flowers."));
            categoryRepository.save(new Category("Dancing Lady", "Oncidium orchids named for the unique dancing shape of their blooms."));
            categoryRepository.save(new Category("Slipper Orchid", "Paphiopedilum orchids characterized by pouch-like lips."));
            categoryRepository.save(new Category("Pansy Orchid", "Miltoniopsis orchids with flat open faces resembling pansy flowers."));
            categoryRepository.save(new Category("Spider Orchid", "Brassia orchids known for long, spreading spider-like tepals."));
            categoryRepository.save(new Category("Zygopetalum", "Famous for highly fragrant, waxy, and intricately patterned flowers."));
            categoryRepository.save(new Category("Crucifix Orchid", "Epidendrum orchids with small, brilliantly colored clusters."));
            categoryRepository.save(new Category("Jewel Orchid", "Ludisia discolor grown for stunning velvety foliage with striking veins."));
            categoryRepository.save(new Category("Darwin's Orchid", "Angraecum sesquipedale with long nectar spur predicted by Charles Darwin."));
            categoryRepository.save(new Category("Masdevallia", "Cool-growing orchids with vibrant, triangular-shaped flowers."));
            categoryRepository.save(new Category("Maxillaria", "Coconut Orchid with flowers that smell remarkably like roasted coconut."));
            categoryRepository.save(new Category("Vanilla Orchid", "Primary source of the popular natural vanilla flavoring."));
            System.out.println(">>> Seeded default Categories");
        }

        // 3. Seed Orchids if empty.
        // Images are referenced as "src/assets/N.png": the frontend bundles everything
        // under src/assets at build time and resolveOrchidImage() maps the file name to
        // the hashed bundle URL, so these keep working once deployed.
        if (orchidRepository.count() == 0) {
            save("Phalaenopsis Orchid", "Moth Orchid", "Southeast Asia", "Pink", 4.7,
                 "src/assets/1.png",
                 "https://www.youtube.com/embed/_Mxr6Gqt7Gg?si=ZojYwXWTgcVOMKXC",
                 "Known as the Moth Orchid, it is one of the most popular and easy-to-grow orchids in the world.",
                 true, true);
            save("Cymbidium Orchid", "Boat Orchid", "Himalayas", "Yellow", 4,
                 "src/assets/2.png",
                 "https://www.youtube.com/embed/HFLBjhQVjWw?si=CuJQ2szXQHBM6shZ",
                 "Cymbidium orchids are prized for their beautiful, long-lasting sprays of flowers.",
                 false, true);
            save("Dendrobium Nobile", "Dendrobium", "Hybrid", "White", 4,
                 "src/assets/3.png",
                 "https://www.youtube.com/embed/4fz5BuIKb3g?si=IAvoNDJ-rC5oryZ7",
                 "A very popular hybrid orchid known for its prolific blooming along the cane.",
                 false, false);
            save("Cattleya Orchid", "Corsage Orchid", "South America", "Purple", 5,
                 "src/assets/4.png",
                 "https://www.youtube.com/embed/s4G8mawk1LA?si=wiwuv1FcOtJGGwrz",
                 "Often called the Queen of Orchids, famous for their large, fragrant blooms.",
                 true, true);
            save("Vanda Orchid", "Vanda", "Southeast Asia", "Blue", 5,
                 "src/assets/5.png",
                 "https://www.youtube.com/embed/Y-AUhijwl30",
                 "Vandas are monopodial orchids known for their large, vibrant, and sometimes fragrant flowers.",
                 true, true);
            save("Oncidium Orchid", "Dancing Lady", "Central America", "Yellow", 4,
                 "src/assets/6.png",
                 "https://www.youtube.com/embed/2h8JudeDNzA",
                 "Often referred to as the Dancing Lady orchid due to the unique shape of its flowers.",
                 false, true);
            save("Paphiopedilum", "Slipper Orchid", "Asia", "Green/Brown", 5,
                 "src/assets/7.png",
                 "https://www.youtube.com/embed/ATLgJIhE0rY",
                 "Characterized by a unique pouch-like lip, they are highly sought after by collectors.",
                 true, true);
            save("Miltoniopsis", "Pansy Orchid", "Andes Mountains", "Red/White", 3,
                 "src/assets/8.png",
                 "https://www.youtube.com/embed/OodFkEW4IdM",
                 "These orchids have flat, open faces that strongly resemble pansy flowers.",
                 false, true);
            save("Brassia", "Spider Orchid", "Tropical America", "Yellow/Green", 4,
                 "src/assets/9.png",
                 "https://www.youtube.com/embed/PDsT6DcRGKo",
                 "Known as Spider Orchids because of their long, spreading tepals.",
                 false, true);
            save("Zygopetalum", "Zygopetalum", "Hybrid", "Purple/Green", 4,
                 "src/assets/10.png",
                 "https://www.youtube.com/embed/rG4dvg5n6Kk",
                 "Famous for their highly fragrant, waxy, and intricately patterned flowers.",
                 false, false);
            save("Epidendrum", "Crucifix Orchid", "Americas", "Orange", 3,
                 "src/assets/11.png",
                 "https://www.youtube.com/embed/vK62kKyFuCU",
                 "Tough, reed-stemmed orchids that produce clusters of small, brilliantly colored flowers.",
                 false, true);
            save("Ludisia discolor", "Jewel Orchid", "Southeast Asia", "White", 4,
                 "src/assets/12.png",
                 "https://www.youtube.com/embed/6z25Vh1ZgDA",
                 "Grown more for its stunning velvety foliage with striking veins than for its small flowers.",
                 false, true);
            save("Angraecum sesquipedale", "Darwin's Orchid", "Madagascar", "White", 5,
                 "src/assets/13.png",
                 "https://www.youtube.com/embed/RxiGlUCgSuc",
                 "Famous for its incredibly long nectar spur, predicted by Charles Darwin to be pollinated by a specific moth.",
                 true, true);
            save("Masdevallia", "Masdevallia", "Cloud Forests of Andes", "Red", 3,
                 "src/assets/14.png",
                 "https://www.youtube.com/embed/DZBZtPkfYUA",
                 "Cool-growing orchids with vibrant, triangular-shaped flowers that lack typical pseudobulbs.",
                 false, true);
            save("Maxillaria tenuifolia", "Maxillaria", "Central America", "Red/Dark Orange", 4,
                 "src/assets/15.png",
                 "https://www.youtube.com/embed/lAxIN3ICcKk",
                 "Commonly called the Coconut Orchid because its dark red flowers smell remarkably like roasted coconut.",
                 false, true);
            save("Vanilla planifolia", "Vanilla Orchid", "Mesoamerica", "Green/Yellow", 5,
                 "src/assets/16.png",
                 "https://www.youtube.com/embed/1RdoTcDD2EU",
                 "A vining orchid species that is the primary source of the popular vanilla flavoring.",
                 true, true);
            System.out.println(">>> Seeded default Orchids");
        }
    }

    private void save(String name, String category, String origin, String color, double rating,
                      String img, String videoUrl, String description,
                      boolean special, boolean natural) {
        Orchid orchid = new Orchid();
        orchid.setName(name);
        orchid.setCategory(category);
        orchid.setOrigin(origin);
        orchid.setColor(color);
        orchid.setRating(rating);
        orchid.setImg(img);
        orchid.setVideoUrl(videoUrl);
        orchid.setDescription(description);
        orchid.setIsSpecial(special);
        orchid.setIsNatural(natural);
        orchidRepository.save(orchid);
    }
}
