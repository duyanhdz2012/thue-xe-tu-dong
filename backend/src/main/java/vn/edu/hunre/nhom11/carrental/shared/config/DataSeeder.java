package vn.edu.hunre.nhom11.carrental.shared.config;
import java.math.BigDecimal;import org.springframework.boot.CommandLineRunner;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;import org.springframework.security.crypto.password.PasswordEncoder;import vn.edu.hunre.nhom11.carrental.catalog.domain.*;import vn.edu.hunre.nhom11.carrental.catalog.repository.*;import vn.edu.hunre.nhom11.carrental.content.domain.News;import vn.edu.hunre.nhom11.carrental.content.repository.NewsRepository;import vn.edu.hunre.nhom11.carrental.identity.domain.*;import vn.edu.hunre.nhom11.carrental.identity.repository.UserRepository;
@Configuration public class DataSeeder{
  @Bean CommandLineRunner seed(UserRepository users,PasswordEncoder encoder,BrandRepository brands,CarTypeRepository types,CarRepository cars,NewsRepository news){
    return args->{
      if(users.count()>0) return;
      User admin=user("Quản trị viên","admin@carrental.vn","Admin@123",Role.ADMIN,encoder);
      User customer=user("Khách hàng mẫu","customer@carrental.vn","Customer@123",Role.CUSTOMER,encoder);
      users.save(admin);
      users.save(customer);

      Brand toyota=brand("Toyota",brands);
      Brand vinfast=brand("VinFast",brands);
      Brand kia=brand("Kia",brands);
      Brand mazda=brand("Mazda",brands);
      Brand honda=brand("Honda",brands);
      Brand ford=brand("Ford",brands);
      Brand hyundai=brand("Hyundai",brands);
      Brand mitsu=brand("Mitsubishi",brands);
      Brand mercedes=brand("Mercedes-Benz",brands);
      Brand bmw=brand("BMW",brands);
      Brand porsche=brand("Porsche",brands);

      CarType sedan=type("Sedan",5,types);
      CarType suv=type("SUV",7,types);
      CarType mpv=type("MPV",7,types);
      CarType crossover=type("Crossover",5,types);
      CarType electric=type("Xe điện",7,types);
      CarType luxury=type("Xe sang",5,types);

      car("Toyota Camry 2.0Q","30A-123.45",new BigDecimal("1200000"),"Sedan rộng rãi, tiết kiệm và phù hợp cho chuyến công tác.","Hà Nội",2025,toyota,sedan,"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",cars);
      car("VinFast VF 8","30E-888.88",new BigDecimal("1650000"),"SUV điện hiện đại, khoang xe yên tĩnh và nhiều công nghệ an toàn.","Hà Nội",2025,vinfast,electric,"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",cars);
      car("Kia Carnival Signature","29A-567.89",new BigDecimal("2200000"),"MPV 7 chỗ cao cấp cho gia đình và nhóm bạn.","Nội Bài",2024,kia,suv,"https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",cars);
      car("Mazda CX-5 2.0 Premium","30H-112.34",new BigDecimal("950000"),"Crossover thiết kế KODO tinh tế, 10 loa Bose, camera 360.","Hà Nội",2024,mazda,crossover,"https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",cars);
      car("Honda CR-V L-Sensing","51K-992.88",new BigDecimal("1100000"),"SUV 7 chỗ rộng rãi, động cơ Turbo tiết kiệm, an toàn Honda Sensing.","TP. Hồ Chí Minh",2024,honda,suv,"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",cars);
      car("Ford Everest Titanium 4x4","43A-678.90",new BigDecimal("1650000"),"SUV địa hình cơ bắp Mỹ, dẫn động 4 bánh 4WD, lội nước 800mm.","Đà Nẵng",2024,ford,suv,"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",cars);
      car("Hyundai SantaFe Calligraphy","30G-777.66",new BigDecimal("1500000"),"Phiên bản cao cấp, nội thất da Nappa, dẫn động HTRAC đầm chắc.","Hà Nội",2023,hyundai,suv,"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",cars);
      car("Mitsubishi Xpander Premium","51H-334.55",new BigDecimal("750000"),"MPV 7 chỗ bán chạy nhất, gầm cao 225mm, điều hòa siêu mát.","TP. Hồ Chí Minh",2024,mitsu,mpv,"https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",cars);
      car("Toyota Vios G CVT","29E-889.01",new BigDecimal("600000"),"Sedan quốc dân bền bỉ, tiết kiệm xăng 5.8L/100km, cốp sau rộng 506L.","Hà Nội",2024,toyota,sedan,"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",cars);
      car("VinFast VF 9 Plus 7 chỗ","43E-999.88",new BigDecimal("2200000"),"SUV điện Full-size đẳng cấp thương gia, ghế massage sưởi/làm mát.","Đà Nẵng",2024,vinfast,electric,"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",cars);
      car("Mercedes-Benz C200 Avantgarde","51L-123.88",new BigDecimal("2400000"),"Sedan hạng sang nước Đức, màn hình 11.9 inch, đèn viền 64 màu.","TP. Hồ Chí Minh",2024,mercedes,luxury,"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",cars);
      car("BMW 320i M Sport","30K-456.78",new BigDecimal("2600000"),"Trải nghiệm lái thể thao đỉnh cao, bodykit M Sport, phân bổ tải trọng 50:50.","Hà Nội",2024,bmw,luxury,"https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",cars);
      car("Porsche Macan GTS","51K-888.66",new BigDecimal("4800000"),"Đỉnh cao SUV thể thao hiệu năng cao, V6 Twin-Turbo 434 mã lực.","TP. Hồ Chí Minh",2024,porsche,luxury,"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",cars);

      News n=new News();
      n.setTitle("Kinh nghiệm thuê xe tự lái an toàn");
      n.setContent("Kiểm tra giấy tờ, tình trạng xe và đọc kỹ điều khoản trước khi nhận xe.");
      news.save(n);
    };
  }
private User user(String n,String e,String p,Role r,PasswordEncoder encoder){User u=new User();u.setName(n);u.setEmail(e);u.setPassword(encoder.encode(p));u.setRole(r);return u;}private Brand brand(String n,BrandRepository r){Brand b=new Brand();b.setName(n);return r.save(b);}private CarType type(String n,int s,CarTypeRepository r){CarType t=new CarType();t.setName(n);t.setSeats(s);return r.save(t);}private void car(String n,String plate,BigDecimal price,String d,String l,int y,Brand b,CarType t,String img,CarRepository r){Car c=new Car();c.setName(n);c.setLicensePlate(plate);c.setDailyPrice(price);c.setDescription(d);c.setLocation(l);c.setModelYear(y);c.setBrand(b);c.setCarType(t);c.setImageUrl(img);r.save(c);}}
