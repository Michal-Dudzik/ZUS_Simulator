using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ZusSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZusController : ControllerBase
    {
        public IActionResult GetRetirment()
        {
            return Ok("Hello from ZusSimulator!");
        }
    }
}
