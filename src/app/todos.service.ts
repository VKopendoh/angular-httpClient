import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, delay, map, tap} from 'rxjs/operators';

export interface Todo {
    completed: boolean;
    title: string;
    id?: number;
}

@Injectable({providedIn: 'root'})
export class TodosService {
    constructor(private http: HttpClient) {
    }

    addTodo(todo: Todo): Observable<Todo> {
        const myHeaders = new HttpHeaders({
            MyCustomHeader: Math.random().toString(),
            newHeader: '123'
        });
        return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
            headers: myHeaders
        });
    }


    fetchTodos(): Observable<Todo[]> {
        let myParams = new HttpParams();
        myParams = myParams.append('_limit', '4');
        myParams = myParams.append('someParan', 'value');
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
            params: myParams,
            observe: 'response'
            // params: new HttpParams().set('_limit', '3')
        })
            .pipe(
                map(response => {
                    console.log('Response', response);
                    return response.body;
                }),
                delay(500),
                catchError(err => {
                    console.log('Error:', err.message);
                    return throwError(err);
                })
            )
            ;
    }

    removeTodo(id: number): Observable<any> {
        return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            observe: 'events'
        }).pipe(
            tap(event => {
                if (event.type === HttpEventType.Sent) {
                    console.log('Sent', event);
                }
                if (event.type === HttpEventType.Response) {
                    console.log('Response', event);
                }
            })
        );
    }

    completeTodo(id: number): Observable<Todo> {
        return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            completed: true
        }, {
            // responseType: 'text' // По умолчанию json как и надо, поломали для эксперимента
        });
    }

}
