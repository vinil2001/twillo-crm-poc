using Microsoft.AspNetCore.Mvc;

namespace TwilioCrmApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ICustomerRepository customerRepository, ILogger<CustomersController> logger)
    {
        _customerRepository = customerRepository;
        _logger = logger;
    }

    [HttpGet("by-phone")]
    public ActionResult<Customer?> GetByPhone([FromQuery] string number)
    {
        if (string.IsNullOrEmpty(number))
        {
            return BadRequest("Phone number is a required parameter");
        }

        _logger.LogInformation("Searching customer by phone: {PhoneNumber}", number);

        try
        {
            var customer = _customerRepository.GetByPhone(number);
            
            if (customer == null)
            {
                _logger.LogInformation("Customer with phone {PhoneNumber} not found", number);
                return NotFound();
            }

            _logger.LogInformation("Found customer: {CustomerName} for phone {PhoneNumber}", 
                customer.Name, number);
            
            return Ok(customer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching for customer by phone {PhoneNumber}", number);
            return StatusCode(500, "Error searching for customer");
        }
    }

    [HttpGet]
    public ActionResult<IEnumerable<Customer>> GetAll()
    {
        _logger.LogInformation("Retrieving all customers");

        try
        {
            var customers = _customerRepository.GetAll();
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customers list");
            return StatusCode(500, "Error retrieving customers list");
        }
    }

    [HttpPost]
    public ActionResult<Customer> Create([FromBody] CreateCustomerRequest request)
    {
        _logger.LogInformation("Creating new customer: {CustomerName}", request.Name);

        // Note: InMemoryRepository does not support creation.
        // This will be implemented when moving to a real DB.
        return StatusCode(501, "Customer creation is not supported in the PoC version");
    }
}

public record CreateCustomerRequest
{
    public string Name { get; init; } = "";
    public string Phone { get; init; } = "";
    public string? Email { get; init; }
    public string? AccountId { get; init; }
    public string? Notes { get; init; }
}

