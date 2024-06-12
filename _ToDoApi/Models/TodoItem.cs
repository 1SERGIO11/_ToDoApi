namespace _ToDoApi.Models
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }
        public long UserId { get; set; }
        public long CategoryId { get; set; }
        public User User { get; set; }
        public Category Category { get; set; }
    }
}
