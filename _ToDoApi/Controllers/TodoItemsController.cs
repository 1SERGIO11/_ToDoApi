using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _ToDoApi.Models;

namespace _ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/TodoItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems([FromQuery] long userId, [FromQuery] long? categoryId)
        {
            var query = _context.TodoItems.AsQueryable();

            if (userId != 0)
            {
                query = query.Where(item => item.UserId == userId);
            }

            if (categoryId.HasValue && categoryId != 0)
            {
                query = query.Where(item => item.CategoryId == categoryId);
            }

            return await query.ToListAsync();
        }



        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // PUT: api/TodoItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(todoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoItems
        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            if (todoItem == null || string.IsNullOrEmpty(todoItem.Name) || todoItem.UserId <= 0 || todoItem.CategoryId <= 0)
            {
                return BadRequest("Invalid data.");
            }

            // Загрузка связанных данных (пользователя и категории) из базы данных
            var user = await _context.Users.FindAsync(todoItem.UserId);
            var category = await _context.Categories.FindAsync(todoItem.CategoryId);

            if (user == null || category == null)
            {
                return BadRequest("Invalid user or category.");
            }

            // Привязка навигационных свойств
            todoItem.User = user;
            todoItem.Category = category;

            _context.TodoItems.Add(todoItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving data: {ex.Message}");
            }

            return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
        }





        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly TodoContext _context;

        public UsersController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<User>> GetAll() =>
            _context.Users.ToList();

        [HttpGet("{id}")]
        public ActionResult<User> Get(long id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public IActionResult Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly TodoContext _context;

        public CategoriesController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Category>> GetAll() =>
            _context.Categories.ToList();

        [HttpGet("{id}")]
        public ActionResult<Category> Get(long id)
        {
            var category = _context.Categories.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        [HttpPost]
        public IActionResult Create(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
        }
    }

}
