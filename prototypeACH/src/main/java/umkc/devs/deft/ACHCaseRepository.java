package umkc.devs.deft;

//import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Steven on 2/28/2016.
 */
public interface ACHCaseRepository extends CrudRepository<ACHCase, Long>
{
    List<ACHCase> findAll();
}
