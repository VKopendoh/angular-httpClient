import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay} from 'rxjs/operators';
import {Todo, TodosService} from "./todos.service";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    todos: Todo[] = [];

    loading = false;

    todoTitle = '';

    error = '';

    constructor(private todosService: TodosService) {
    }

// https://jsonplaceholder.typicode.com/
    ngOnInit(): void {
        this.fetchTodos();
    }

    addTodo() {
        if (!this.todoTitle.trim()) {
            return;
        }

        this.todosService.addTodo({
            title: this.todoTitle,
            completed: false
        }).subscribe(todo => {
            this.todos.push(todo);
            this.todoTitle = '';
        });
    }

    fetchTodos() {
        this.loading = true;
        this.todosService.fetchTodos()
            .subscribe(todos => {
                console.log(todos);
                this.todos = todos;
                this.loading = false;
            }, error => {
                console.log(error.message);
                this.error = error.message;
            });
    }

    removeTodo(id: number) {
        this.todosService.removeTodo(id)
            .subscribe(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                console.log(this.todos);
            });
    }

    completeTodo(id: number) {
        this.todosService.completeTodo(id)
            .subscribe(todo => {
                // console.log('Text todo', todo);
                // todo = JSON.parse(todo); // Если принимаем текст то нужно его распарсить в json
                this.todos.find(t => t.id === todo.id).completed = true;
                console.log(todo);
            });
    }
}
