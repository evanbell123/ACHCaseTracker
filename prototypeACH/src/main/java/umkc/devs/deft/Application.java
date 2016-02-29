package umkc.devs.deft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.VndErrors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDate;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@SpringBootApplication
public class Application
{
    @Bean
    CommandLineRunner init(CaseRepository caseRepository)
    {
        return (evt) ->
                Arrays.asList("3,1,2,4".split(","))
                        .forEach(c -> {
                            caseRepository.save(new ACHCase(Integer.parseInt(c), "Beneficiary Name", 2938.44,
                                    new DateTime(DateTimeZone.UTC), new LocalDate(), 3, "Open"));
                        });
    }

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
        this.add(linkTo(methodOn(CaseRestController.class, assignedTo).readBookmark(assignedTo, achCase.getId())).withSelfRel());
    }

    public ACHCase getCase() { return achCase; }
}

@RestController
@RequestMapping("/cases")
class CaseRestController
{
    private final CaseRepository caseRepository;

    @RequestMapping(method = RequestMethod.POST)
    ResponseEntity<?> add(@RequestBody ACHCase input)
    {
        //this.validateUser(assignedTo);

        ACHCase achCase = caseRepository.save(new ACHCase(input.assignedTo, input.beneficiary, input.totalAmt,
                                         input.openedOn, input.sla, input.daysOpen, input.status));

        HttpHeaders httpHeaders = new HttpHeaders();

        Link forOneBookmark = new CaseResource(achCase).getLink("self");
        httpHeaders.setLocation(URI.create(forOneBookmark.getHref()));

        return new ResponseEntity<>(null, httpHeaders, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{caseId}", method = RequestMethod.GET)
    CaseResource readBookmark(@PathVariable Integer assignedTo, @PathVariable Long caseId)
    {
        //this.validateUser(assignedTo);
        return new CaseResource(this.caseRepository.findOne(caseId));
    }

    @RequestMapping(method = RequestMethod.GET)
    Resources<CaseResource> readBookmarks()
    {
        //this.validateUser(assignedTo);

        List<CaseResource> bookmarkResourceList = caseRepository.findAll()
                .stream()
                .map(CaseResource::new)
                .collect(Collectors.toList());
        return new Resources<>(bookmarkResourceList);
    }

    @Autowired
    CaseRestController(CaseRepository caseRepository)
    {
        this.caseRepository = caseRepository;
    }

   /* private void validateUser(String userId)
    {
        this.accountRepository.findByUsername(userId).orElseThrow(() -> new UserNotFoundException(userId));
    }*/
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

class UserNotFoundException extends RuntimeException
{
    public UserNotFoundException(String userId)
    {
        super("could not find user '" + userId + "'.");
    }
}

