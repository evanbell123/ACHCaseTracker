package umkc.devs.deft;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Created by Steven on 2/28/2016.
 */
public interface CaseRepository extends JpaRepository<ACHCase, Long>
{
    List<ACHCase> findAll();
}
