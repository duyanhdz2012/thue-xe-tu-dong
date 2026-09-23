package vn.edu.hunre.nhom11.carrental.content.repository;import java.util.List;import org.springframework.data.jpa.repository.JpaRepository;import vn.edu.hunre.nhom11.carrental.content.domain.News;public interface NewsRepository extends JpaRepository<News,Long>{List<News>findByPublishedTrueOrderByCreatedAtDesc();}

