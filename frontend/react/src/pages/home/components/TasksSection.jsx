import { quickTasks } from "../homeConstants";

function TasksSection() {
  return (
    <section className="tasks-section">
      <div className="section-heading">
        <span>What users can do</span>
        <h2>Built for daily tasks, not complicated workflows.</h2>
      </div>

      <div className="task-pills">
        {quickTasks.map((task) => (
          <div className="task-pill" key={task}>
            {task}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TasksSection;