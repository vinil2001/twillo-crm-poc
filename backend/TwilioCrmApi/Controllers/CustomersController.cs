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
            return BadRequest("Номер телефону є обов'язковим параметром");
        }

        _logger.LogInformation("Пошук клієнта за номером: {PhoneNumber}", number);

        try
        {
            var customer = _customerRepository.GetByPhone(number);
            
            if (customer == null)
            {
                _logger.LogInformation("Клієнта з номером {PhoneNumber} не знайдено", number);
                return NotFound();
            }

            _logger.LogInformation("Знайдено клієнта: {CustomerName} для номера {PhoneNumber}", 
                customer.Name, number);
            
            return Ok(customer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Помилка пошуку клієнта за номером {PhoneNumber}", number);
            return StatusCode(500, "Помилка пошуку клієнта");
        }
    }

    [HttpGet]
    public ActionResult<IEnumerable<Customer>> GetAll()
    {
        _logger.LogInformation("Отримання списку всіх клієнтів");

        try
        {
            var customers = _customerRepository.GetAll();
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Помилка отримання списку клієнтів");
            return StatusCode(500, "Помилка отримання списку клієнтів");
        }
    }

    [HttpPost]
    public ActionResult<Customer> Create([FromBody] CreateCustomerRequest request)
    {
        _logger.LogInformation("Створення нового клієнта: {CustomerName}", request.Name);

        // Примітка: InMemoryRepository не підтримує створення, 
        // це буде реалізовано при переході на реальну БД
        return StatusCode(501, "Створення клієнтів поки не підтримується в PoC версії");
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
