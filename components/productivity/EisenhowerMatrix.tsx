import { 
  CheckCircle2, 
  Circle, 
  MoreVertical, 
  Plus, 
  Trash2, 
  PencilLine,
  MoveDiagonal,
  X,
  Info
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// Task type
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  quadrant: 'doFirst' | 'schedule' | 'delegate' | 'eliminate';
  createdAt: Date;
}

// Quadrant configuration type
interface Quadrant {
  id: 'doFirst' | 'schedule' | 'delegate' | 'eliminate';
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

export function EisenhowerMatrix() {
  // Initial tasks
  const initialTasks: Task[] = [
    {
      id: '1',
      title: 'Complete HTML course assignment',
      description: 'Finish the HTML exercises for Module 3 by tomorrow',
      completed: false,
      quadrant: 'doFirst',
      createdAt: new Date('2025-05-29T10:00:00')
    },
    {
      id: '2',
      title: 'Study CSS Grid layout',
      description: 'Go through documentation and try out examples for upcoming project',
      completed: false,
      quadrant: 'schedule',
      createdAt: new Date('2025-05-29T11:30:00')
    },
    {
      id: '3',
      title: 'Reply to forum messages',
      description: 'Check study group forum and respond to questions',
      completed: false,
      quadrant: 'delegate',
      createdAt: new Date('2025-05-29T14:00:00')
    },
    {
      id: '4',
      title: 'Browse new JavaScript tutorials',
      description: 'Look for interesting materials for future reference',
      completed: false,
      quadrant: 'eliminate',
      createdAt: new Date('2025-05-29T16:30:00')
    }
  ];

  // Quadrant configurations
  const quadrants: Quadrant[] = [
    {
      id: 'doFirst',
      title: 'Do First',
      description: 'Important & Urgent',
      color: 'bg-red-500',
      icon: <div className="rounded-full bg-red-100 p-2"><CheckCircle2 className="h-4 w-4 text-red-500" /></div>
    },
    {
      id: 'schedule',
      title: 'Schedule',
      description: 'Important & Not Urgent',
      color: 'bg-blue-500',
      icon: <div className="rounded-full bg-blue-100 p-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /></div>
    },
    {
      id: 'delegate',
      title: 'Delegate',
      description: 'Not Important & Urgent',
      color: 'bg-yellow-500',
      icon: <div className="rounded-full bg-yellow-100 p-2"><CheckCircle2 className="h-4 w-4 text-yellow-500" /></div>
    },
    {
      id: 'eliminate',
      title: 'Eliminate',
      description: 'Not Important & Not Urgent',
      color: 'bg-gray-500',
      icon: <div className="rounded-full bg-gray-100 p-2"><X className="h-4 w-4 text-gray-500" /></div>
    }
  ];

  // State
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  // Add a new task
  const addTask = (quadrant: Quadrant['id']) => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      description: '',
      completed: false,
      quadrant,
      createdAt: new Date()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    toast.success('Task added');
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task removed');
  };

  // Toggle task completion status
  const toggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  // Update task
  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    toast.success('Task updated');
  };

  // Move task to another quadrant
  const moveTask = (taskId: string, newQuadrant: Quadrant['id']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, quadrant: newQuadrant } 
        : task
    ));
    toast.success('Task moved');
  };

  // Filter tasks by quadrant
  const getQuadrantTasks = (quadrantId: Quadrant['id']) => {
    return tasks.filter(task => task.quadrant === quadrantId);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mb-1">Eisenhower Matrix</h1>
          <p className="text-muted-foreground">
            Prioritize your tasks by importance and urgency
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsInfoDialogOpen(true)}
        >
          <Info className="h-4 w-4 mr-2" />
          How it works
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map(quadrant => (
          <Card key={quadrant.id} className="overflow-hidden">
            <CardHeader className={`${quadrant.color} text-white`}>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  {quadrant.title}
                </CardTitle>
                <div className="bg-white text-black px-2 py-1 rounded-full text-xs">
                  {quadrant.description}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4 flex">
                <Input
                  placeholder={`Add a task to ${quadrant.title.toLowerCase()}...`}
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="rounded-r-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTask(quadrant.id);
                    }
                  }}
                />
                <Button 
                  className="rounded-l-none" 
                  onClick={() => addTask(quadrant.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {getQuadrantTasks(quadrant.id).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tasks yet</p>
                    <p className="text-sm">Add a task to get started</p>
                  </div>
                ) : (
                  getQuadrantTasks(quadrant.id).map(task => (
                    <div 
                      key={task.id}
                      className={`p-3 border rounded-md ${task.completed ? 'bg-muted/30' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleComplete(task.id)}
                            className="flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <div className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditingTask(task)}>
                              <PencilLine className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onSelect={() => toggleComplete(task.id)}
                              className={task.completed ? "text-red-500" : "text-green-500"}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              {task.completed ? 'Mark incomplete' : 'Mark complete'}
                            </DropdownMenuItem>
                            
                            {/* Move To Submenu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger className="w-full flex items-center px-2 py-1.5 text-sm">
                                <MoveDiagonal className="h-4 w-4 mr-2" />
                                <span>Move to...</span>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {quadrants.filter(q => q.id !== quadrant.id).map(q => (
                                  <DropdownMenuItem 
                                    key={q.id} 
                                    onSelect={() => moveTask(task.id, q.id)}
                                  >
                                    {q.title}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <DropdownMenuItem 
                              onSelect={() => deleteTask(task.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open: boolean) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update your task details
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button onClick={() => editingTask && updateTask(editingTask)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>How to Use the Eisenhower Matrix</DialogTitle>
            <DialogDescription>
              Organize your tasks by importance and urgency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-muted-foreground">
              The Eisenhower Matrix is a productivity tool that helps you prioritize tasks by sorting them into four quadrants:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></div>
                <div>
                  <h4>Do First (Important & Urgent)</h4>
                  <p className="text-sm text-muted-foreground">Tasks that require immediate attention and are important for your goals. Focus on these first.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
                <div>
                  <h4>Schedule (Important & Not Urgent)</h4>
                  <p className="text-sm text-muted-foreground">Tasks that are important but not time-sensitive. Schedule these for later.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-yellow-500 flex-shrink-0 mt-0.5"></div>
                <div>
                  <h4>Delegate (Not Important & Urgent)</h4>
                  <p className="text-sm text-muted-foreground">Tasks that are time-sensitive but don't contribute much to your goals. Delegate these if possible.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-gray-500 flex-shrink-0 mt-0.5"></div>
                <div>
                  <h4>Eliminate (Not Important & Not Urgent)</h4>
                  <p className="text-sm text-muted-foreground">Tasks that are neither important nor time-sensitive. Consider eliminating these from your to-do list.</p>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground pt-2">
              Add tasks to the appropriate quadrants, mark them as complete when done, and move them between quadrants as priorities change.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsInfoDialogOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}