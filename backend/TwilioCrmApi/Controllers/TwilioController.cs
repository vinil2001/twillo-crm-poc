using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Twilio.Jwt.AccessToken;
using Twilio.TwiML;

namespace TwilioCrmApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TwilioController : ControllerBase
{
    private readonly IHubContext<CallsHub> _hubContext;
    private readonly TwilioConfig _twilioConfig;
    private readonly ILogger<TwilioController> _logger;

    public TwilioController(
        IHubContext<CallsHub> hubContext,
        IOptions<TwilioConfig> twilioConfig,
        ILogger<TwilioController> logger)
    {
        _hubContext = hubContext;
        _twilioConfig = twilioConfig.Value;
        _logger = logger;
    }

    [HttpPost("voice/webhook")]
    public async Task<IActionResult> VoiceWebhook([FromForm] VoiceWebhookRequest request)
    {
        _logger.LogInformation("Received incoming call from number: {From}, CallSid: {CallSid}", 
            request.From, request.CallSid);

        try
        {
            // Broadcast incoming call event via SignalR
            await _hubContext.Clients.All.SendAsync("incomingCall", new
            {
                fromNumber = request.From,
                callSid = request.CallSid,
                timestampUtc = DateTime.UtcNow
            });

            // Return TwiML response
            var response = new VoiceResponse();
            response.Say("Please hold while we connect you to an operator.", 
                language: "en-IE");
            response.Play("http://com.twilio.music.classical.s3.amazonaws.com/BusyStrings.wav");

            return Content(response.ToString(), "application/xml");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing incoming call");
            
            var errorResponse = new VoiceResponse();
            errorResponse.Say("Sorry, an error occurred. Please try again later.");
            return Content(errorResponse.ToString(), "application/xml");
        }
    }

    [HttpGet("token")]
    public IActionResult GetToken([FromQuery] string identity)
    {
        if (string.IsNullOrEmpty(identity))
        {
            return BadRequest("Identity is a required parameter");
        }

        try
        {
            // Create Twilio Access Token
            var grants = new HashSet<IGrant>
            {
                new VoiceGrant
                {
                    OutgoingApplicationSid = _twilioConfig.TwiMlAppSid,
                    IncomingAllow = true
                }
            };

            var token = new Token(
                _twilioConfig.AccountSid,
                _twilioConfig.ApiKeySid,
                _twilioConfig.ApiKeySecret,
                identity: identity,
                grants: grants);

            return Ok(token.ToJwt());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Twilio token for identity: {Identity}", identity);
            return StatusCode(500, "Error creating token");
        }
    }

    [HttpPost("test/incoming-call")]
    public async Task<IActionResult> TestIncomingCall([FromBody] TestCallRequest request)
    {
        _logger.LogInformation("Test incoming call from number: {From}", request.FromNumber);

        try
        {
            // Broadcast test event via SignalR
            await _hubContext.Clients.All.SendAsync("incomingCall", new
            {
                fromNumber = request.FromNumber,
                callSid = $"test-{Guid.NewGuid()}",
                timestampUtc = DateTime.UtcNow
            });

            return Ok(new { message = "Test call sent" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test call");
            return StatusCode(500, "Error sending test call");
        }
    }
}

public record VoiceWebhookRequest
{
    public string From { get; init; } = "";
    public string CallSid { get; init; } = "";
    public string CallStatus { get; init; } = "";
    public string Direction { get; init; } = "";
}

public record TestCallRequest
{
    public string FromNumber { get; init; } = "";
}

