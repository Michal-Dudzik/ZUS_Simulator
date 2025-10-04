using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ZusSimulator.Services.Services.AdminPanel;

namespace ZusSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminPanelController : ControllerBase
    {
        private readonly IAdminPanelService adminPanelService;

        public AdminPanelController(IAdminPanelService adminPanelService)
        {
            this.adminPanelService = adminPanelService;
        }

        [HttpGet("totalRequests")]
        public async Task<ActionResult> GetTotalRequests()
        {
            return Ok(await adminPanelService.TotalRequests());
        }

        [HttpGet("totalSimpleRequests")]
        public async Task<ActionResult> GetTotalSimpleRequests()
        {
            return Ok(await adminPanelService.TotalSimpleRequests());
        }

        [HttpGet("totalAdvancedRequests")]
        public async Task<ActionResult> GetTotalAdvancedRequests()
        {
            return Ok(await adminPanelService.TotalAdvancedRequests());
        }

        [HttpGet("totalPersonalDataAdded")]
        public async Task<ActionResult> GetTotalPersonalDataAdded()
        {
            return Ok(await adminPanelService.TotalPersonalDataAdded());
        }

        [HttpGet("totalAverages")]
        public async Task<ActionResult> GetTotalAverages()
        {
            return Ok(await adminPanelService.TotalAveragess());
        }

        [HttpGet("totalMins")]
        public async Task<ActionResult> GetTotalMins()
        {
            return Ok(await adminPanelService.TotalMins());
        }

        [HttpGet("totalMaxes")]
        public async Task<ActionResult> GetTotalMaxes()
        {
            return Ok(await adminPanelService.TotalMaxes());
        }

        [HttpGet("totalPercentageUsage")]
        public async Task<ActionResult> GetTotalPercentageUsage()
        {
            return Ok(await adminPanelService.TotalPercentageUsage());
        }
    }
}
