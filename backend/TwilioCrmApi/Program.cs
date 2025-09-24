using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Twilio.Jwt.AccessToken;
using Twilio.TwiML;

var builder = WebApplication.CreateBuilder(args);

// Додати сервіси
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Конфігурація CORS для Angular
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Конфігурація Twilio
builder.Services.Configure<TwilioConfig>(builder.Configuration.GetSection("Twilio"));

// Додати репозиторій клієнтів (в пам'яті для PoC)
builder.Services.AddSingleton<ICustomerRepository, InMemoryCustomerRepository>();

var app = builder.Build();

// Конфігурація pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();

app.MapControllers();
app.MapHub<CallsHub>("/hubs/calls");

app.Run();

// SignalR Hub для трансляції подій дзвінків
public class CallsHub : Hub
{
    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }
}

// Конфігурація Twilio
public class TwilioConfig
{
    public string AccountSid { get; set; } = "";
    public string ApiKeySid { get; set; } = "";
    public string ApiKeySecret { get; set; } = "";
    public string TwiMlAppSid { get; set; } = "";
}

// Модель клієнта
public record Customer
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string? Email { get; set; }
    public string? AccountId { get; set; }
    public string? Notes { get; set; }
}

// Інтерфейс репозиторію
public interface ICustomerRepository
{
    Customer? GetByPhone(string phone);
    IEnumerable<Customer> GetAll();
}

// Репозиторій в пам'яті для PoC
public class InMemoryCustomerRepository : ICustomerRepository
{
    private static readonly List<Customer> _customers = new()
    {
        new Customer
        {
            Id = "1",
            Name = "Dublin Tech Solutions Ltd",
            Phone = "+353851234567",
            Email = "contact@dublintech.ie",
            AccountId = "ACC-001",
            Notes = "VIP client, priority support required"
        },
        new Customer
        {
            Id = "2",
            Name = "Liam O'Connor",
            Phone = "+353861234567",
            Email = "liam.oconnor@gmail.com",
            Notes = "Regular customer since 2020"
        },
        new Customer
        {
            Id = "3",
            Name = "Aoife Murphy",
            Phone = "+353871234567",
            Email = "aoife.murphy@example.ie",
            AccountId = "ACC-002",
            Notes = "New client from Cork"
        },
        new Customer
        {
            Id = "4",
            Name = "Trinity College Dublin",
            Phone = "+35318961000",
            Email = "procurement@tcd.ie",
            AccountId = "ACC-003",
            Notes = "Educational institution, bulk services"
        },
        new Customer
        {
            Id = "5",
            Name = "Guinness Storehouse",
            Phone = "+353014084800",
            Email = "info@guinness-storehouse.com",
            AccountId = "ACC-004",
            Notes = "Tourism sector client"
        }
    };

    public Customer? GetByPhone(string phone) => _customers.FirstOrDefault(c => c.Phone == phone);
    public IEnumerable<Customer> GetAll() => _customers;
}
