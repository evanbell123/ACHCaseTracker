package umkc.devs.deft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.VndErrors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@SpringBootApplication
public class Application
{
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
class CaseResource extends ResourceSupport
{
    private final ACHCase achCase;

    public CaseResource(ACHCase achCase)
    {
        Integer assignedTo = achCase.getAssignedTo();
        this.achCase = achCase;
        this.add(new Link(achCase.getStatus(), "case-status"));
        this.add(linkTo(CaseRestController.class, assignedTo).withRel("cases"));
        this.add(linkTo(methodOn(CaseRestController.class, assignedTo).readCase(achCase.getId())).withSelfRel());
    }

    public ACHCase getCase() { return achCase; }
}

@RestController
@RequestMapping("api/cases")
class CaseRestController
{
    private final ACHCaseRepository achCaseRepository;

    @RequestMapping(method = RequestMethod.POST)  // http://localhost:8080/api/cases
    ResponseEntity<?> add(@RequestBody ACHCase input)
    {
        ACHCase achCase = achCaseRepository.save(new ACHCase(input.assignedTo, input.beneficiaryName, input.totalAmt,
                                         input.openedDate, input.sla, input.daysOpen, input.status, input.notes));

        HttpHeaders httpHeaders = new HttpHeaders();

        Link forOneCase = new CaseResource(achCase).getLink("self");
        httpHeaders.setLocation(URI.create(forOneCase.getHref()));

        return new ResponseEntity<>(null, httpHeaders, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{caseId}", method = RequestMethod.GET)  // http://localhost:8080/api/cases/1
    CaseResource readCase(@PathVariable Long caseId)
    {
        return new CaseResource(this.achCaseRepository.findOne(caseId));
    }

    @RequestMapping(method = RequestMethod.GET)  // http://localhost:8080/api/cases/
    Resources<CaseResource> readCases()
    {
        List<CaseResource> caseResourceList = achCaseRepository.findAll()
                .stream()
                .map(CaseResource::new)
                .collect(Collectors.toList());
        return new Resources<>(caseResourceList);
    }

    @Autowired
    CaseRestController(ACHCaseRepository achCaseRepository)
    {
        this.achCaseRepository = achCaseRepository;
    }

    // Leaving this as a reminder to use a similar validation method when necessary later on.
    /*
    private void validateUser(String userId)
    {
        this.accountRepository.findByUsername(userId).orElseThrow(() -> new UserNotFoundException(userId));
    }
    */
}

@ControllerAdvice
class CaseControllerAdvice
{
    @ResponseBody
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    VndErrors userNotFoundExceptionHandler(UserNotFoundException ex)
    {
        return new VndErrors("error", ex.getMessage());
    }
}

// Not used but left as a reminder for future reference.
class UserNotFoundException extends RuntimeException
{
    public UserNotFoundException(String userId)
    {
        super("could not find user '" + userId + "'.");
    }
}

