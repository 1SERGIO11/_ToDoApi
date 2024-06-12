using Microsoft.AspNetCore.Mvc;
using _ToDoApi.Models;
using System.Linq;

namespace _ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TodoContext _context;

        public AuthController(TodoContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User userLogin)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == userLogin.Username && u.Password == userLogin.Password);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new { success = true, user });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User userRegister)
        {
            var user = new User { Username = userRegister.Username, Password = userRegister.Password };
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { success = true, user });
        }
    }
}
