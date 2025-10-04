using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ZusSimulator.Services.Models;
using ZusSimulator.Services.Services.RequstCollector;

namespace ZusSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZusController : ControllerBase
    {
        private readonly IRequstCollectorService requstCollectorService;

        public ZusController(IRequstCollectorService requstCollectorService)
        {
            this.requstCollectorService = requstCollectorService;
        }

        [HttpPost("simple-form")]
        public async Task<IActionResult> PostSimpleResult(SimpleFormResultRequest request)
        {
            var dbId = await requstCollectorService.SaveSimpleFormResultAsync(request);
            return Ok(dbId);
        }

        [HttpPost("advanced-form")]
        public async Task<IActionResult> PostAdvancedResult(AdvancedFormResultRequest request)
        {
            var dbId = await requstCollectorService.SaveAdvancedFormResultAsync(request);
            return Ok(dbId);
        }

        [HttpPost("personal-data")]
        public async Task<IActionResult> PostPersonalData(PersonalDataRequest request)
        {
            var result = await requstCollectorService.UpdateWithPersonalData(request);
            return (result ? Ok() : NotFound());
        }
    }
}
